function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),post = locals_.post,moment = locals_.moment,marked = locals_.marked,user = locals_.user;buf.push("<div" + (jade.attrs({ 'data-id':(post.id), "class": [('post')] }, {"data-id":true})) + "><div class=\"meta clearfix\"><div class=\"username datum\">" + (jade.escape(null == (jade.interp = post.user.name) ? "" : jade.interp)) + "</div><div class=\"time datum\"><i class=\"fa fa-clock-o\"></i><a" + (jade.attrs({ 'data-timestamp':(post.created_at.toString()), 'href':("#" + post.id), 'name':(post.id), "class": [('distance')] }, {"data-timestamp":true,"href":true,"name":true})) + ">" + (jade.escape(null == (jade.interp = moment(post.created_at).fromNow()) ? "" : jade.interp)) + "<div class=\"unread\"><i class=\"fa fa-file-o\"></i></div></a></div></div><div class=\"content\">" + (null == (jade.interp = marked(post.body || '')) ? "" : jade.interp));
if ( (post.user.signature))
{
buf.push("<div class=\"signature\">" + (null == (jade.interp = post.user.signature) ? "" : jade.interp) + "</div>");
}
buf.push("</div>");
if ( (post.user.id === user.id))
{
buf.push("<form action=\"/edit\" method=\"POST\" class=\"edit hidden\"><div class=\"input\"><textarea class=\"input-textarea\">" + (null == (jade.interp = post.body) ? "" : jade.interp) + "</textarea><button type=\"submit\" class=\"input-submit\">Submit</button></div></form>");
}
buf.push("<div class=\"actions\"><a href=\"#quote\" class=\"action quote fa fa-quote-left fa-lg\"></a><div class=\"advanced\">");
if ( (post.user.id === user.id))
{
buf.push("<a href=\"#destroy\" class=\"action destroy fa fa-trash-o fa-lg\"></a>");
}
buf.push("</div>");
if ( (post.user.id === user.id))
{
buf.push("<a href=\"#edit\" class=\"action edit fa fa-edit fa-lg\"></a>");
}
buf.push("</div></div>");;return buf.join("");
}