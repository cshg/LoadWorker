//  parser.js
//
const PEG = require('pegjs');

const parserArguments = `
start = line

line = nl* first:linetype rest:(nl+ data:linetype { return data; })* {
  rest.unshift(first); return rest;
}

linetype = ifwhile / function / command / comment 

comment "comment"
 = "#" text

ifwhile "if/while" = type:("if" / "while") "(" head:command ")" _ "{" _ data:line _ "}" {
  return {type:type, operator:head, params: data}
}

command = space first:CallExpression tail:(" " argument)* {
  var params = [];
  for (var i = 0; i < tail.length; i++) {
    params.push(tail[i][1]);
  }
  return {type:'CallExpression', operator:first, params: params}
}
argument "argument" = string / subexpression / variable / primitive
subexpression = "(" space command:command space ")" {
  return command;
}

function "function"
 = "func " head:text "(" args:functionargs ")" _ "{" _ data:line _ "}"  {
  return {type:'function', operator:head, args: args, params: data}
}
functionargs = first:$[^),]* tail:("," space each:$[^),]* { return each;} )* {
  if (first === "") { return [];}
  tail.unshift(first); return tail;
}

variable = "$" variable:$ns+ {
  return {type:'variable', name:variable}
} 
//$ns+
CallExpression = $ns+

string = "'" str:$notquote* "'" {
  return {type:'primitive', value:str}
}

primitive = primitive:$ns+ {
  return {type:'primitive', value:primitive}
}
text = $ns*
_ "whitespace" = [ \\t\\n\\r]*
ns "non-special" = [^\\t\\n\\r(){} #]
notquote "not a single quote" = [^\\t\\n\\r(){}#']
nl "newline" = [\\n\\r\\t]
space "space" = [ ]*
`;

const parser = PEG.buildParser(parserArguments.trim());

module.exports = parser;
