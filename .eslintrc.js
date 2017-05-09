module.exports = {
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "globals": {
        "document": true,
        "foo": true,
        "window": true,
        "fetch": true,
        "EventSource": true
    },
    "rules": {
        "no-tabs": "off",
        "react/jsx-indent": [2, "tab"],
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "comma-dangle": ["error", "never"],
        "jsx-quotes": ["error", "prefer-single"],
        "indent": [2, "tab"],
        "arrow-body-style": ["error", "as-needed"],
        "space-before-function-paren": ["error", "always"],
        "quote-props": ["error", "consistent-as-needed"],
        "react/jsx-indent-props": [2, "tab"]
    }
};
