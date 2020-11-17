module.exports = {<% if(type ==='vue'){ %>
  "root": true,<% } %>
  "env": {
    "browser": true,
    "es6": true
  },<% if(type ==='react'){ %>
  "parser": "babel-eslint",<% } %>
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",<% if(type ==='react'){ %>
    "ecmaFeatures": {
      "jsx": true
    }<% } else { %>
    "parser": "babel-eslint"<% } %>
  },
  // 插件 (根据项目实际情况安装自定义插件)<% if(type ==='vue'){ %>
  "extends": ["plugin:vue/essential", "plugin:prettier/recommended", "prettier/vue"],<% } else { %>
  "extends": ["plugin:prettier/recommended"],<% } %>
  "rules":{
    // eslint 规则
  }
}

