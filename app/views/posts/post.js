function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),post = locals_.post;buf.push("<section class=\"post\"><div class=\"meta clearfix\"><div class=\"username datum\">" + (jade.escape(null == (jade.interp = post.user.name) ? "" : jade.interp)) + "</div><div class=\"time datum\"><i class=\"fa fa-clock-o\"></i>" + (jade.escape(null == (jade.interp = post.created_at) ? "" : jade.interp)) + "</div></div><div class=\"content\">" + (null == (jade.interp = post.body) ? "" : jade.interp) + "</div></section>");;return buf.join("");
}
