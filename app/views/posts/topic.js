function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),post = locals_.post,getPostDate = locals_.getPostDate,moment = locals_.moment,user = locals_.user;buf.push("<div" + (jade.attrs({ 'data-id':(post.id), "class": [('topic')] }, {"data-id":true})) + "><div class=\"meta clearfix\"><div class=\"title\"><a" + (jade.attrs({ 'href':('/topic/' + post.id) }, {"href":true})) + ">" + (jade.escape(null == (jade.interp = post.title) ? "" : jade.interp)) + "</a></div><div class=\"extra\"><div class=\"replies\"><span class=\"count\">" + (jade.escape(null == (jade.interp = post.children.length) ? "" : jade.interp)) + "</span> Replies.</div><div class=\"username datum\">" + (jade.escape(null == (jade.interp = post.user.name) ? "" : jade.interp)) + "</div><div class=\"time datum\"><i class=\"fa fa-clock-o\"></i><div" + (jade.attrs({ 'data-timestamp':(getPostDate(post)), "class": [('distance')] }, {"data-timestamp":true})) + ">" + (jade.escape(null == (jade.interp = moment(getPostDate(post)).fromNow()) ? "" : jade.interp)) + "</div></div></div></div><div class=\"actions\"><a" + (jade.attrs({ 'href':('/topic/' + post.id + '#reply'), "class": [('action'),('reply'),('fa'),('fa-reply'),('fa-flip-vertical'),('fa-lg')] }, {"href":true})) + "></a><div class=\"advanced\">");
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
