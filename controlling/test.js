var polynom = new MathLib.Polynomial([10,2,7,0,0,4.7]);
console.log(polynom);
console.log('toString', polynom.toString());
console.log('toContentMathML', polynom.toContentMathML());
console.log('toMathML', polynom.toMathML());
console.log('toFunctn', polynom.toFunctn());
console.log('toLaTeX', polynom.toLaTeX());

console.log(polynom.differentiate());
console.log(polynom.toString(), polynom.valueAt(1).toString());
console.log(polynom.differentiate().toString(), polynom.differentiate().valueAt(1).toString());

jQuery(document).ready(function(){
  var hook = jQuery('#hook');
  function append(content){
    hook.append('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">'+content+'</math>');
  };

  function display(content){
    hook.append('<div style="text-align: center;">'+content+'</div>');
  };

  append(polynom.toMathML());
  append(polynom.toMathML());
  display(1);
});
