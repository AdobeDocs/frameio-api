/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import React, {
  Children,
  cloneElement,
  useCallback,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { useDebouncedCallback } from 'use-debounce';
import { withPrefix } from 'gatsby';
import globals from '../../conf/globals';

const ROOT_FIX = '/_ROOT_/';

const isBrowser = () => typeof window !== 'undefined';

const cleanMarkdownExtension = pathname => {
  return pathname
    .replace('/src/pages/', '/')
    .replace('/index.md/', '')
    .replace('/index.md', '')
    .replace('index.md', '')
    .replace('.md/', '')
    .replace('.md', '');
};

const trailingSlashFix = pathname => {
  if (!pathname.endsWith('/')) {
    return `${pathname}/`;
  }

  return pathname;
};

const normalizePagePath = page => {
  if (page?.path) {
    if (isExternalLink(page.path)) {
      page.href = page.path;
    } else {
      const { pathname, search, hash } = new URL(page.path, 'https://example.com');
      const normalizedPath = trailingSlashFix(cleanMarkdownExtension(pathname));

      page.pathname = decodeURIComponent(normalizedPath);
      page.href = `${normalizedPath}${search}${hash}`;
    }
  }
};

const rootFix = pathname => {
  if (pathname === withPrefix('/')) {
    return withPrefix(ROOT_FIX);
  }

  return pathname;
};

const cleanRootFix = url => url.replace(ROOT_FIX, '/');

const rootFixPages = pages => {
  const rootFixedPages = JSON.parse(JSON.stringify(pages));

  return rootFixedPages.map(page => {
    if (page.pathname === '/') {
      page.pathname = ROOT_FIX;
      page.href = `${ROOT_FIX}${page.href.slice(1)}`;
    } else if (page.menu) {
      page.menu = rootFixPages(page.menu);
    }

    return page;
  });
};

const layoutColumns = (columns, gutters = []) => {
  // Override 3 columns to 2 because it was too narrow.
  // See: https://github.com/adobe/aio-theme/blob/main/packages/gatsby-theme-aio/src/components/MDXFilter/index.js#L235-L237
  if (columns === 3) {
    columns = 2
  }
  return `calc(${columns} * var(--spectrum-global-dimension-static-grid-fixed-max-width) / var(--spectrum-global-dimension-static-grid-columns)${
    gutters.length > 0 ? ` - ${gutters.join(' - ')}` : ''
  })`
};

const findSelectedTopPage = (pathname, pages) =>
  pages.find(
    page =>
      pathname.startsWith(withPrefix(page.pathname)) || findSelectedTopPageMenu(pathname, page)
  );

const findSelectedTopPageMenu = (pathname, page) => {
  const res = page?.menu && page.menu.find(menuPage => pathname === menuPage.pathname);
  return res ? res : findSelectedTopPageMenuByPrefix(pathname, page);
};

const findSelectedTopPageMenuByPrefix = (pathname, page) =>
  page?.menu && page.menu.find(menuPage => pathname.startsWith(withPrefix(menuPage.pathname)));

const findSubPages = (pathname, pages, subPages) => {
  if (subPages == null) {
    return [];
  }

  const selectedTopPage = findSelectedTopPage(pathname, pages);
  return subPages.filter(
    page =>
      withPrefix(page.pathname).startsWith(withPrefix(selectedTopPage?.pathname)) ||
      (selectedTopPage?.menu &&
        selectedTopPage.menu
          .filter(menuPage => pathname.startsWith(withPrefix(menuPage.pathname)))
          .find(menuPage => withPrefix(page.pathname).startsWith(withPrefix(menuPage.pathname))))
  );
};

const findSelectedPage = (pathname, pages) => {
  if (pages == null) {
    return [];
  }

  return pages?.find(page => pathname === withPrefix(page.pathname));
};

const findSelectedPages = (pathname, pages) => {
  if (pages == null) {
    return [];
  }

  let selectedPages = [];
  let level = 1;

  const find = page => {
    let subPages = [];
    if (page.pathname && pathname.startsWith(withPrefix(page.pathname))) {
      page.level = level;
      subPages.push(page);
    }

    if (page.pages) {
      level++;
      page.pages.forEach(subPage => {
        subPages = [...subPages, ...find(subPage)];
      });
    }

    return subPages;
  };

  pages.forEach(page => {
    const subPages = find(page);
    if (subPages.length) {
      selectedPages.push(subPages);
    }
  });

  return selectedPages.length ? selectedPages.pop() : [];
};

const flattenPages = pages => {
  if (pages == null) {
    return [];
  }

  let flat = [];
  const find = page => {
    flat.push(page);

    if (page.pages) {
      page.pages.forEach(find);
    }
  };

  pages.forEach(find);

  flat = flat.flat();
  return flat.filter((page, index) => page.pathname && page.pathname !== flat[index + 1]?.pathname);
};

const findSelectedPageNextPrev = (pathname, pages) => {
  const flat = flattenPages(pages);
  const selectedPage = flat.find(page => withPrefix(page.pathname) === pathname);

  return {
    nextPage: flat[flat.indexOf(selectedPage) + 1],
    previousPage: flat[flat.indexOf(selectedPage) - 1],
  };
};

const findSelectedPageSiblings = (pathname, pages) => {
  let siblings = [];

  if (pages == null) {
    return siblings;
  }

  const find = page => {
    if (page.pages) {
      const selectedPage = page.pages.find(subPage => withPrefix(subPage.pathname) === pathname);
      if (selectedPage) {
        siblings = [...page.pages];
      } else {
        page.pages.forEach(find);
      }
    }
  };

  pages.forEach(page => {
    find(page);
  });

  return siblings;
};

const isInternalLink = (pathname, location, allPaths) => {
  if (!pathname) {
    return false;
  }

  const base = new URL(location.pathname, 'https://example.com');
  const requestedPath = decodeURI(
    trailingSlashFix(cleanMarkdownExtension(new URL(pathname, base).pathname))
  );

  return allPaths.some(path => path === requestedPath);
};

const fixInternalLink = (pathname, location, pathPrefix) => {
  const base = new URL(location.pathname, 'https://example.com');
  const url = new URL(pathname, base);

  return `${trailingSlashFix(cleanMarkdownExtension(url.pathname.replace(pathPrefix, '')))}${
    url.search
  }${url.hash}`;
};

const isExternalLink = url => {
  url = String(url).replace('#', '');

  let isExternal = true;
  try {
    new URL(url);
  } catch (e) {
    isExternal = false;
  }

  return isExternal;
};

const getExternalLinkProps = (url = null) =>
  url === null || (isExternalLink(url) && !new URL(url).searchParams.has('aio_internal'))
    ? {
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
      }
    : {};

const getElementChild = element => React.Children.toArray(element.props.children)[0];

const cloneChildren = (children, changeProps) => {
  return Children.map(children, child => {
    if (child?.props?.children) {
      child = cloneElement(child, {
        children: cloneChildren(child.props.children, changeProps),
      });
    }

    return changeProps(child);
  });
};

// Modified to actually grab the parent size https://github.com/dagda1/cuttingedge/blob/main/packages/use-get-parent-size/src/useParentSize/useParentSize.ts

const initialContentRect = {
  bottom: undefined,
  height: undefined,
  left: undefined,
  width: undefined,
  right: undefined,
  top: undefined,
  x: undefined,
  y: undefined,
};

const isNil = val => typeof val === 'undefined' || val === null;

const useParentSize = (
  ref,
  {
    debounceDelay = 500,
    initialValues = initialContentRect,
    transformFunc = o => o,
    maxDifference = 10,
    callback = o => o,
  }
) => {
  const [contentRect, setContentRect] = useState({
    ...initialContentRect,
    ...initialValues,
  });
  const rerenderCount = useRef(0);
  const previousContentRect = useRef(initialValues);

  const transformer = useCallback(transformFunc, [transformFunc]);

  if (!ref) console.error('You must pass a valid ref to useParentSize');

  const debouncedCallback = useDebouncedCallback(
    value => {
      setContentRect(value);
      callback(value);
    },
    debounceDelay,
    {
      leading: true,
    }
  );

  const refElement = ref.current;

  useLayoutEffect(() => {
    if (isNil(refElement)) {
      if (rerenderCount.current > 10) {
        throw new Error('Maximum rerender count and no refElement Found');
      }

      setContentRect({ ...contentRect });
      rerenderCount.current++;
      return;
    }

    if (isNil(refElement.parentNode)) {
      if (rerenderCount.parentNode > 10) {
        throw new Error('Maximum rerender count and no parentNode Found');
      }

      setContentRect({ ...contentRect });
      rerenderCount.parentNode++;
      return;
    }

    const resizeObserver = new ResizeObserver(entries => {
      if (!Array.isArray(entries) || entries.length !== 1) {
        return;
      }

      const entry = entries[0];
      const newWidth = Math.round(entry.contentRect.width);
      const newHeight = Math.round(entry.contentRect.height);

      const widthDiff = Math.abs(newWidth - (previousContentRect.current.width ?? 0));
      const heightDiff = Math.abs(newHeight - (previousContentRect.current.height ?? 0));

      if (widthDiff > maxDifference || heightDiff > maxDifference) {
        previousContentRect.current.height = newHeight;
        previousContentRect.current.width = newWidth;
        debouncedCallback(entry.contentRect);
      }
    });

    requestAnimationFrame(() => resizeObserver?.observe(refElement.parentNode));

    return () => {
      if (!!refElement.parentNode) {
        resizeObserver?.unobserve(refElement.parentNode);
      }
    };
  }, [maxDifference, debouncedCallback, refElement, initialValues, contentRect]);

  return useMemo(() => transformer(contentRect), [contentRect, transformer]);
};

const DEFAULT_HOME = {
  title: 'Products',
  href: '/apis/',
};
const SEARCH_PARAMS = {
  query: 'query',
  keywords: 'keywords',
  index: 'index',
};
const SIDENAV_WIDTH = globals.SIDENAV_WIDTH;
const MOBILE_SCREEN_WIDTH = globals.MOBILE_SCREEN_WIDTH;
const TABLET_SCREEN_WIDTH = globals.TABLET_SCREEN_WIDTH;
const DESKTOP_SCREEN_WIDTH = globals.DESKTOP_SCREEN_WIDTH;
const DESKTOP_FOOTER_SCREEN_WIDTH_MAX = globals.DESKTOP_FOOTER_SCREEN_WIDTH_MAX;

export {
  normalizePagePath,
  cleanMarkdownExtension,
  trailingSlashFix,
  rootFix,
  rootFixPages,
  cleanRootFix,
  layoutColumns,
  findSelectedTopPage,
  findSelectedTopPageMenu,
  findSubPages,
  findSelectedPage,
  findSelectedPages,
  flattenPages,
  findSelectedPageNextPrev,
  findSelectedPageSiblings,
  isBrowser,
  isInternalLink,
  fixInternalLink,
  isExternalLink,
  getExternalLinkProps,
  getElementChild,
  cloneChildren,
  useParentSize,
  DEFAULT_HOME,
  SEARCH_PARAMS,
  SIDENAV_WIDTH,
  MOBILE_SCREEN_WIDTH,
  TABLET_SCREEN_WIDTH,
  DESKTOP_SCREEN_WIDTH,
  DESKTOP_FOOTER_SCREEN_WIDTH_MAX,
};
