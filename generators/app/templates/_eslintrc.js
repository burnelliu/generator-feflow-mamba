module.exports = {<% if(type ==='vue'){ %>
  "root": true,<% } %>
  "env": {
    "browser": true,
    "es6": true
  },<% if(type !=='vue'){ %>
  "parser": "babel-eslint",<% } %>
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",<% if(type !=='vue'){ %>
    "ecmaFeatures": {
      "jsx": true
    }<% } else { %>
    "parser": "babel-eslint"<% } %>
  },
  "extends": ['',<% if(type ==='vue'){ %> 'plugin:vue/essential',<% } %> 'plugin:prettier/recommended'],<% if(type ==='tea-app'){ %>
  "plugins": [""],<% } %>
  // 若是新项目，需要将以下规则放开
  "rules":{
    "no-unused-vars": "off",
    "prefer-promise-reject-errors": "off",
    "no-new-func": "off",
    "no-prototype-builtins": "off",
    "no-async-promise-executor": "off",
    "camelcase": "off",
    "handle-callback-err": "off",
    "no-useless-escape": "off"
  }
}