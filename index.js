const cheerio = require('cheerio');
const axios = require('axios');
const ejs = require('ejs');
const BASE = 'https://docs.agora.io/cn/Interactive%20Broadcast/API%20Reference/web/v2.5'

async function getDom (url) {
  return axios.get(url).then(({data}) => {
    return cheerio.load(data)
  })
}

async function parse (name, type, url) {
  console.log(`Parsing ${url}`)
  var $ = await getDom(url), d;
  const ns = {
    type,
    name,
    url,
    typeAliases: [],
    variables: [],
    properties: [],
    functions: [],
    methods: [],
    indexables: [],
    interfaces: [],
    modules: []
  }

  const c = $('.article-body .row .col-content');
  const h2s = c.find('h2')

  //Type aliases
  d = h2s.filter((_, it) => $(it).text() == 'Type aliases').parent();
  d.find('.tsd-kind-type-alias').each((i, it) => {
    ns.typeAliases.push($(it).find('.tsd-signature').text().trim().replace(': ',' = '));
  });

  // Variables
  d = h2s.filter((_, it) => $(it).text() == 'Variables').parent();
  d.find('.tsd-kind-variable').each((i, it) => {
    ns.variables.push($(it).find('.tsd-signature').text().trim());
  });

  // Properties
  d = h2s.filter((_, it) => $(it).text() == 'Properties').parent();
  d.find('.tsd-kind-property').each((i, it) => {
    let sig = $(it).find('.tsd-signature').text().trim();
    if ($(it).find('.ts-flagOptional').length) sig = sig.replace(':','?:');
    ns.properties.push(sig);
  });

  // Functions
  d = h2s.filter((_, it) => $(it).text() == 'Functions').parent();
  d.find('.tsd-kind-function .tsd-signatures:not(.tsd-kind-type-literal)').each((i, it) => {
    ns.functions.push($(it).find('.tsd-signature').text().trim().replace(/function/g, 'Function'));
  });

  // Methods
  d = h2s.filter((_, it) => $(it).text() == 'Methods').parent();
  d.find('.tsd-kind-method .tsd-signatures:not(.tsd-kind-type-literal)').each((i, it) => {
    ns.methods.push($(it).find('.tsd-signature').toArray().map(s => {
      return $(s).text().trim().replace(/function/g, 'Function')
    }).join(";\n\t\t"));
  });

  const h3s = c.find('h3');
  var ary;

  // Interfaces
  d = h3s.filter((_, it) => $(it).text() == "Interfaces").parent();
  ary = d.find('.tsd-kind-interface').toArray();
  for(let i in ary) {
    const it = ary[i];
    const anchor = $(it).find('a');
    const href = anchor.attr('href');
    const name = anchor.text();
    const url = `${BASE}/${href}`
    ns.interfaces.push(await parse(name, 'interface', url));
  }

  // Modules
  d = h3s.filter((_, it) => $(it).text() == "Modules").parent();
  ary = d.find('.tsd-kind-module').toArray();
  for(let i in ary) {
    const it = ary[i];
    const anchor = $(it).find('a');
    const href = anchor.attr('href');
    const name = anchor.text();
    const url = `${BASE}/${href}`
    ns.modules.push(await parse(name, 'module', url));
    // ns.modules.push($(it).find('a').attr('href'));
  }

  // Indexable
  d = h3s.filter((_, it) => $(it).text() == 'Indexable').parent();
  d.find('.tsd-signature').each((i, it) => {
   ns.indexables.push($(it).text());
  })
  return ns;
}

global.decodeEntities = function decodeEntities(encodedString) {
    var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
    var translate = {
        "nbsp":" ",
        "amp" : "&",
        "quot": "\"",
        "lt"  : "<",
        "gt"  : ">"
    };
    return encodedString.replace(translate_re, function(match, entity) {
        return translate[entity];
    }).replace(/&#(\d+);/gi, function(match, numStr) {
        var num = parseInt(numStr, 10);
        return String.fromCharCode(num);
    });
}

global.json2ts = json2ts;
function json2ts (ns) {
  return ejs.render(
`<% if(type === 'interface') {%>
export <%} else if(type === 'namespace') { -%>
declare <%} else { -%>
<% } -%>
<%=type%> <%-name%> {
  <% if (typeAliases.length) {%>// type aliases<% } %>
  <% for(let i in typeAliases) {-%>
  type <%- decodeEntities(typeAliases[i]) %>;
  <% } -%>
  <% if (variables.length) {%>// variables<% } %>
  <% for(let i in variables) {-%>
  let <%- decodeEntities(variables[i]) %>;
  <% } -%>
  <% if (properties.length) {%>// properties<% } %>
  <% for(let i in properties) {-%>
  <%- decodeEntities(properties[i]) %>;
  <% } -%>
  <% if (functions.length) {%>// functions<% } %>
  <% for(let i in functions) {-%>
  function <%- decodeEntities(functions[i]) %>;
  <% } -%>
  <% if (methods.length) {%>// methods<% } %>
  <% for(let i in methods) {-%>
  <%- decodeEntities(methods[i])%>;
  <% } -%>
  <% if (modules.length) {%>// modules<% } -%>
  <% for(let i in modules) {-%>
  <%- json2ts(modules[i]) %>
  <% } -%>
  <% if (interfaces.length) {%>// interfaces<% } -%>
  <% for(let i in interfaces) {-%>
  <%- json2ts(interfaces[i]) %>
  <% } -%>
  <% if (indexables.length) {%>// indexables<% } %>
  <% for(let i in indexables) {-%>
  <%- decodeEntities(indexables[i])%>;
  <% } -%>
}
`, ns)
}



async function main () {
  const fs = require('fs');
  const arg = process.argv[2];
  if (arg === '--json') {
    const agora = await parse('"agora-rtc-sdk"', 'declare module', `${BASE}/globals.html`);
    fs.writeFileSync('./agora.d.json', JSON.stringify(agora, null, 2));
    console.log('Done! Now use --ts to generate agora.d.ts file');
  } else if (arg === '--ts') {
    let ts = json2ts(JSON.parse(fs.readFileSync('./agora.d.json').toString('utf-8')));
    fs.writeFileSync('./src/@types/agora-rtc-sdk/index.d.ts', ts);
    console.log('Done! Check out agora.d.ts')
  } else {
    console.log(`arguments: [--json | --ts]`)
  }
}

main()