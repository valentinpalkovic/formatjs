---
id: message-distribution
title: Message Distribution
---

Now that you've declared your messages, extracted them, sent them to your translation vendor and they have given you back the translated JSON of the same format, it's time to talk about how to distribute & consume the translated JSON.

## Converting raw format

Let's take the example from [Message Extraction](./message-extraction.md), assuming we are working with the French version and the file is called `lang/fr.json`:

```json
{
  "hak27d": {
    "defaultMessage": "Panneau de configuration",
    "description": "title of control panel section"
  },
  "haqsd": {
    "defaultMessage": "Supprimer l'utilisateur {name}",
    "description": "delete button"
  },
  "19hjs": {
    "defaultMessage": "nouveau mot de passe",
    "description": "placeholder text"
  },
  "explicit-id": {
    "defaultMessage": "Confirmez le mot de passe",
    "description": "placeholder text"
  }
}
```

We can use [@formatjs/cli](../tooling/cli.md) to compile this into a react-intl consumable JSON file:

```sh
formatjs compile lang/fr.json --out-file compiled-lang/fr.json
```

## Distribution

While every application has a separate distribution pipeline, the common theme is the ability to map a locale to its translation file. In this example we'll assume your pipeline can understand dynamic `import`:

1. In a React application

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {IntlProvider} from 'react-intl';

function loadLocaleData(locale: string): Promise<Record<string, string>> {
  switch (locale) {
    case 'fr':
      return import('compiled-lang/fr.json');
    default:
      return import('compiled-lang/en.json');
  }
}

function App(props) {
  return (
    <IntlProvider
      locale={props.locale}
      defaultLocale="en"
      messages={props.messages}
    >
      <MainApp />
    </IntlProvider>
  );
}

async function bootstrapApplication(locale, mainDiv) {
  const messages = await loadLocaleData(locale);
  ReactDOM.render(<App locale={locale} messages={messages} />, mainDiv);
}
```

2. In a non-React application

```tsx
import {createIntl, createIntlCache} from 'react-intl';

function loadLocaleData(locale: string): Promise<Record<string, string>> {
  switch (locale) {
    case 'fr':
      return import('compiled-lang/fr.json');
    default:
      return import('compiled-lang/en.json');
  }
}

// A single cache instance can be shared for all locales
const intlCache = createIntlCache();

async function bootstrapApplication(locale) {
  const messages = await loadLocaleData(locale);
  const intl = createIntl({locale, messages}, intlCache);
  // Now the intl object is localized and ready to use
}
```