import { RichText } from 'prismic-reactjs';
import { asText } from 'prismic-richtext';

function linkResolver(doc) {
  switch (doc.type) {
    case 'article':
      return `/articles/${doc.slug}`;
    default:
      return '/';
  }
}

function renderAsText(field) {
  try {
    return asText(field);
  } catch (e) {
    console.warn('unable to render field as text', field);
  }

  return '';
}

function renderAsComponentTree(field) {
  if (!field) {
    console.warn('cannot render undefined field');
    return null;
  }

  try {
    const result = RichText.render(field, linkResolver);
    return result;
  } catch (e) {
    console.warn('unable to render field as component tree', field);
  }
  return null;
}

function renderDefault(field) {
  if (field && typeof field === 'object') {
    const keys = Object.keys(field);
    if (keys.length === 1 && keys[0] === 'link_type') {
      return null;
    }
  }

  return field;
}

function getField(field, type = '') {
  switch (type) {
    case 'title':
      return renderAsText(field);
    case 'richtext':
      return renderAsComponentTree(field);
    case 'body':
      // slices
      return field || [];
    default:
      return renderDefault(field);
  }
}

export {
  linkResolver,
  getField,
};
