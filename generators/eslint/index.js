"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const _ = require("lodash");

module.exports = class extends Generator {
  initializing() {
    // Have Yeoman greet the user.
    this.log(
      yosay('集成前端开发规范!')
    );

    this.props = {};

    return new Promise((resolve, reject) => {
      if (!this.fs.exists(this.destinationPath('package.json'))) {
        reject('未找到package.json文件！')
      } else {
        resolve()
      }
    })
  }

  prompting() {
    this.log(chalk.red(`请确定当前在目标文件夹下。`));

    const prompts = [
      {
        type: "list",
        name: "type",
        message: "请选择项目类型",
        choices: [
          {
            name: "vue项目",
            value: "vue"
          },
          {
            name: "react项目",
            value: "react"
          },
          {
            name: "控制台项目",
            value: "tea-app"
          }
        ]
      },
      {
        type: "confirm",
        name: "eslint",
        message: "是否配置eslint?",
        default: true
      },
      {
        type: "confirm",
        name: "stylelint",
        message: "是否配置stylelint?",
        default: true
      },
      {
        type: "confirm",
        name: "commitlint",
        message: "是否配置commitlint?",
        default: true
      },
      {
        type: "confirm",
        name: "commitizen",
        message: "是否配置commitizen?",
        default: false
      },
      {
        type: "confirm",
        name: "prettier",
        message: "是否配置prettier?",
        default: true
      },
      {
        type: "confirm",
        name: "husky",
        message: "是否配置husky?",
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.initPackage();
    this.renderTplFile();

    this.log(chalk.green("🔥配置注入完毕"));
  }

  install() {
    // 优先尝试tnmp安装
    try {
      this.log(chalk.green("正在安装依赖..."));
      this.spawnCommandSync("npm", ["install", "--loglevel", "error"]);
    } catch (err) {
      this.log(chalk.red("发生了预期之外的事情", err));
      this.log(chalk.red("正在尝试重新安装依赖"));
      this.installDependencies({
        npm: { "--registry": "http://taobao.com/" },
        bower: false,
        yarn: false
      });
    }
  }

  end() {
    this.log(chalk.green("🤗若安装依赖失败，请手动安装。"));
    this.log(
      chalk.green(`⭐配置参考文档:
    http://tapd.oa.com/pt_webserver/markdown_wikis/show/#1210132091001716121`)
    );
  }

  // 配置package.json文件
  initPackage() {
    let pkg = this.fs.readJSON(this.destinationPath("package.json"), {});
    const { props } = this;

    if (props.eslint) {
      pkg = _.merge(pkg, {
        scripts: {
          lint: "eslint --ext .vue,.js,.jsx src"
        },
        devDependencies: {
          "babel-eslint": "^10.0.2",
          eslint: "^6.2.0"
        }
      });
    }

    if (props.stylelint) {
      pkg = _.merge(pkg, {
        scripts: {
          "lint:style": "stylelint **/*.{html,vue,jsx,css,sass,scss}"
        },
        devDependencies: {
          stylelint: "^13.7.2",
          "stylelint-config-prettier": "^8.0.2",
          "stylelint-config-rational-order": "^0.1.2",
          "stylelint-prettier": "^1.1.2"
        }
      });
    }

    if (props.commitlint) {
      pkg = _.merge(pkg, {
        devDependencies: {
          "@commitlint/cli": "^11.0.0",
          "@commitlint/config-conventional": "^11.0.0"
        }
      });
    }

    if (props.commitizen) {
      pkg = _.merge(pkg, {
        devDependencies: {
          commitizen: "^4.2.1",
          "cz-conventional-changelog": "^3.3.0"
        },
        scripts: {
          commit: "git-cz"
        },
        config: {
          commitizen: {
            path: "cz-conventional-changelog"
          }
        }
      });
    }

    if (props.prettier) {
      pkg = _.merge(pkg, {
        devDependencies: {
          prettier: "^2.1.2",
          "eslint-config-prettier": "^6.13.0",
          "eslint-plugin-prettier": "^3.1.4"
        }
      });
    }

    if (props.husky) {
      const hooksDep = props.commitlint
        ? {
            hooks: {
              "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
            }
          }
        : {};
      const styleHuskyDep = props.stylelint
        ? {
            "*.{html,vue,css,sass,scss,less,styl}": [
              "stylelint --fix",
              "git add"
            ]
          }
        : {};

      let eslintHuskyDep = {};
      let tmp = [];
      if (props.prettier) {
        tmp.push("prettier --write ./src");
      }

      if (props.eslint) {
        tmp.push("eslint --ext .vue,.js,.jsx --fix ./src");
      }

      if (tmp.length) {
        tmp.push("git add");
        eslintHuskyDep["*.{js,jsx,vue}"] = tmp;
      }

      pkg = _.merge(
        pkg,
        {
          devDependencies: {
            husky: "^4.3.0",
            "lint-staged": "^10.4.2"
          },
          husky: {
            hooks: {
              "pre-commit": "lint-staged"
            }
          },
          "lint-staged": {}
        },
        {
          husky: hooksDep
        },
        {
          "lint-staged": styleHuskyDep
        },
        {
          "lint-staged": eslintHuskyDep
        }
      );
    }

    this.fs.writeJSON(this.destinationPath("package.json"), pkg);
  }

  renderTplFile() {
    let target = [];

    if (this.props.eslint) {
      target = target.concat([["_eslintignore", ".eslintignore"]]);

      if (this.fs.exists(this.destinationPath(".eslintrc"))) {
        target = target.concat([["_eslintrc", ".eslintrc"]]);
      } else {
        target = target.concat([["_eslintrc.js", ".eslintrc.js"]]);
      }
    }

    if (this.props.stylelint) {
      target = target.concat([
        ["_stylelintrc.js", ".stylelintrc.js"],
        ["_stylelintignore", ".stylelintignore"]
      ]);
    }

    if (this.props.commitlint) {
      target = target.concat(["commitlint.config.js"]);
    }

    if (this.props.prettier) {
      target = target.concat([["_prettierrc.js", ".prettierrc.js"]]);
    }

    _.forEach(target, file => {
      let toFile;
      let fromFile;
      if (_.isArray(file)) {
        // eslint-disable-next-line
        fromFile = file[0];
        // eslint-disable-next-line
        toFile = file[1]
      } else {
        fromFile = file;
        toFile = file;
      }

      this.fs.copyTpl(
        this.templatePath(fromFile),
        this.destinationPath(toFile),
        this.props
      );
    });
  }
};