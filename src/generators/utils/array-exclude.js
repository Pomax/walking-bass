module.exports = function excluse(base, remove) {
  remove.forEach(v => {
    let p = base.indexOf(v);
    if (p !== -1) base.splice(p,1);
  });
  return base;
};
