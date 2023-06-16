const config = {
    locales: ['en', 'hr'],
    output: 'src/locales/$LOCALE/$NAMESPACE.json',
    input: ['src/**/*.{ts,tsx,js,jsx}'],
    defaultNamespace: 'translation',
    namespaceSeparator: '-:-',
    keySeparator: false,
    useKeysAsDefaultValue: ['en'],
};

export default config;
