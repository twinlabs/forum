function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),post = locals_.post,moment = locals_.moment,marked = locals_.marked,user = locals_.user;buf.push("<div" + (jade.attrs({ 'data-id':(post.id), 'data-user-id':(post.user.id), "class": [('atom')] }, {"data-id":true,"data-user-id":true})) + "><div class=\"atom-meta meta clearfix\"><div class=\"atom-meta-main\"><div class=\"atom-meta-main-inner username datum\">" + (jade.escape(null == (jade.interp = post.user.name) ? "" : jade.interp)) + "</div><div class=\"atom-meta-extra\"><div class=\"atom-meta-extra-time time datum\"><i class=\"fa fa-clock-o\"></i><a" + (jade.attrs({ 'data-timestamp':(post.created_at.toString()), 'href':("?all=true#" + post.id), 'name':(post.id), "class": [('distance')] }, {"data-timestamp":true,"href":true,"name":true})) + ">" + (jade.escape(null == (jade.interp = moment(post.created_at).fromNow()) ? "" : jade.interp)) + "<span class=\"unread-icon\"><i class=\"fa fa-file-o\"></i></span></a></div></div></div></div><div class=\"content\">" + (null == (jade.interp = marked(post.body || '')) ? "" : jade.interp));
if ( (post.user.signature))
{
buf.push("<div class=\"signature\">" + (null == (jade.interp = post.user.signature) ? "" : jade.interp) + "</div>");
}
buf.push("</div>");
if ( (post.user.id === user.id))
{
buf.push("<form action=\"/edit\" method=\"POST\" class=\"edit is-hidden\"><div class=\"input\"><textarea class=\"input-textarea\">" + (null == (jade.interp = post.body) ? "" : jade.interp) + "</textarea><button type=\"submit\" class=\"input-submit\">Submit</button></div></form>");
}
buf.push("<div class=\"atom-actions\"><div class=\"atom-actions-advanced\">");
if ( (post.user.id === user.id))
{
buf.push("<a href=\"#destroy\" class=\"atom-actions-action atom-actions-action--destroy fa fa-trash-o fa-lg\"></a>");
}
buf.push("</div><a href=\"#quote\" class=\"atom-actions-action atom-actions-action--quote fa fa-quote-left fa-lg\"></a>");
if ( (post.user.id === user.id))
{
buf.push("<a href=\"#edit\" class=\"atom-actions-action atom-actions-action--edit fa fa-edit fa-lg\"></a>");
}
buf.push("</div></div>");;return buf.join("");
}