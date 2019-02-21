/**
 * @class TemplateEngine
 * @description A simple TemplateEngine implementation
 * @author Vuchan <givingwu@gmail.com>
 * @url
 *  - https://gist.github.com/vuchan/af05daa7d21f37623635ec14f9574e70
 *  - http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line
 * @usage
    ```js
      let tpl = 'My skills:' +
      '<% if(this.showSkills) { %>' +
        '<%for(var index in this.skills) {%>' +
        '<a href="#"><%this.skills[index]%></a>' +
        '<%}%>' +
      '<% } else { %>' +
        '<p>none</p>' +
      '<% } %>';

      console.log(template.render(tpl, {
        skills: ["js", "html", "css"],
        showSkills: true
      }));
    ```
 */
class TemplateEngine {
  // TODO: Support custom delimiter string
  constructor () {
    this.reg = /<%([^%>]+)?%>/g // default: delimiter => '%'
    this.regExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g
  }

  // TODO: Support custom compile
  compile (html) {}

  render (html, data) {
    if (!html || !data || typeof html !== 'string' || typeof data !== 'object') {
      throw new Error('Template.render(html: string, data: object) only accept legal params type.')
    }

    const { reg, regExp } = this
    let match = null
    let code = 'var r=[];\n'
    let cursor = 0 // current cursor position flag

    function add (line, js) {
      js ? (code += line.match(regExp) ? line + '\n' : 'r.push(' + line + ');\n') :
              (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
      return add
    }

    /* 递归执行 RegExp.prototype.exec，拿到 match 然后移动 cursor */
    while(match = reg.exec(html)) {
      add(html.slice(cursor, match.index))(match[1], true)
      cursor = match.index + match[0].length
    }

    add(html.substr(cursor, html.length - cursor))
    code += 'return r.join("");'

    return new Function(code.replace(/[\r\t\n]/g, '')).apply(data)
  }
}

const template = new TemplateEngine()
module.exports = template;
// export default new TemplateEngine()

const data = {
  title: '劳保防护',
  desc: '安全可靠更放心',
  children: [{
    title: '劳保防护',
    desc: '安全可靠更放心',
    src: '//img10.360buyimg.com/babel/s340x420_jfs/t1/24337/29/6253/132772/5c4b1fa9Ee0129636/229b6701d116172e.jpg!q90!cc_340x420',
  }, {
    top: {
      title: 'title',
      desc: 'desc',
    },
    btm: {
      title: 'title',
      desc: 'desc',
    }
  }, {
    top: {
      title: 'title',
      desc: 'desc',
    },
    btm: {
      title: 'title',
      desc: 'desc',
    }
  }, {
    top: {
      title: 'title',
      desc: 'desc',
    },
    btm: {
      title: 'title',
      desc: 'desc',
    }
  }, {
    top: {
      title: 'title',
      desc: 'desc',
    },
    btm: {
      title: 'title',
      desc: 'desc',
    }
  }]
}

tpl = `
<div class="yzw-title">
 <h2><% this.title %><small><% this.desc %></small></h2>
 <% if (this.children.length) { %>
  <ul class="yzw-stage-list">
    <% for (var i in this.children) { %>
      <% if (i) { %>
        <figure class="yzw-stage-figure">
          <figcaption>
            <h2><% this.children[i].title %>
            <small><% this.children[i].desc %></small>
          </figcaption>
          <img src="<% this.children[i].src %>" alt="<% this.children[i].title %>">
        </figure>
      <% } else { %>
        <li class="yzw-stage-item">
          <% if (this.children[i].top) { %>
            <div class="yzw-stage-item-top">
              <span> <% this.children[i].top.title + i %> </span>
              <span> <% this.children[i].top.desc + i %> </span>
            </div>
          <% } %>

          <% if (this.children[i].btm) { %>
            <div class="yzw-stage-item-btm">
              <span> <% this.children[i].btm.title + i %> </span>
              <span> <% this.children[i].btm.desc + i %> </span>
            </div>
          <% } %>
        </li>
      <% } %>
    <% } %>
  </ul>
 <% } else { %>
  <p>no any data</p>
 <% } %>
`
// <% var item = this.children[i]; %>
console.log(template.render(tpl, data));