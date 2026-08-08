# I18n Architectural Strategy

To prepare the Quiz Builder for internationalization, I propose adopting `react-i18next` with `i18next` as the underlying framework. This setup is industry-standard for React applications.

## Strategy

1.  **Dependency Addition**:

    ```bash
    npm install react-i18next i18next i18next-browser-languagedetector i18next-http-backend
    ```

2.  **Configuration**:
    - Create `frontend/src/shared/lib/i18n.ts` for configuration, including language detection and backend loading for translations.

3.  **Implementation**:
    - Wrap the application in an `I18nextProvider` or initialize within `main.tsx`.
    - Use the `useTranslation` hook within components to replace hardcoded strings.
    - Organize translations in `frontend/public/locales/{{lng}}/translation.json`.

4.  **Integration**:
    - Gradually replace all UI component labels and placeholder text with translation keys.

## Benefits

- Decouples content from components.
- Easily scalable to support new languages.
- Enables community-driven translations.
