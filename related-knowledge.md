# CORS（跨域资源共享）相关知识点

## 一、简介

默认情况下，XHR只能访问与发起请求的页面在同一个域内的资源，即受到浏览器同源策略的限制。

CORS是为了解决跨域通信而产生的。其背后基本思路就是使用`自定义的`HTTP头部允许浏览器和服务器互相了解，以确定请求或者响应应该成功还是失败。

现代浏览器通过XMLHttpRequest对象原生支持CORS。在尝试访问不同源的资源时，这个行为会被自动触发不需要用户参与，因此对于开发者来说，跨域ajax与同源的ajax通信没有差别，代码完全一致。浏览器一旦发现ajax请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉。

因此，实现CORS通信的关键是服务器，只要服务器实现了支持CORS的接口，就可以跨源通信。

## 二、简单请求与非简单请求

浏览器将CORS请求分为两类：简单请求和非简单请求。

简单请求同时满足以下两大条件：


(1) 请求方法是以下三种之一：
  * HEAD
  * GET
  * POST

(2) 除了由用户代理自动设置的标头（例如，Connection,User-Agent或Fetch 规范中定义为禁止标头名称的其他标头）外，唯一允许手动设置的标头是Fetch规范定义的标头一个 CORS-safelisted请求头，它们是：
  * Accept
  * Accept-Language
  * Content-Language
  * Last-Event-ID
  * Content-Type: 只限三个值application/x-www-form-urlencoded、multipart/form-data、text/plain

凡是不同时满足上面两个条件，就属于非简单请求。

## 三、简单请求

对于简单请求，即在满足上面量大条件的基础上，这样的请求在发送时会有一个额外的头部字段叫Origin, Origin字段包含发送请求的页面的源（协议、域名及端口），以便浏览器确定是否为其提供响应。

如果Origin指定的源，不在许可范围内,服务器会返回一个正常的HTTP响应，但是响应头中没有Access-Control-Allow-Origin字段，浏览器发现响应中没有包含这个字段，就知道出错了，从而抛出一个错误，被XMLHttpRequest的onerror回调函数捕获。注意，这种错误无法通过状态码识别，因为HTTP响应的状态码有可能是200。

如果Origin指定的源在许可范围内，服务器也会返回一个HTTP响应，其响应头会多出几个字段：

```http
这是一段http响应头示例
Access-Control-Allow-Origin: https://www.1958.com/
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: Aliao
Content-Type: text/html; charset=utf-8
...
```
上面的头信息之中，有三个与CORS请求相关的字段，都以Access-Control-开头。

(1) Access-Control-Allow-Origin

该字段是必须的。它的值要么是请求时的Origin字段，要么是一个`*`，表示接受来自任意的源的请求。

(2) Access-Control-Allow-Credentials

该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。如果允许CORS请求中包含Cookie，将这个值设为true即可。如果不允许CORS请求中包含Cookie，则删除该字段即可，因为该字段只能设为true。

(2.1) withCredentials属性

因为CORS请求默认不发送Cookie及HTTP认证信息，因此要把Cookie 发送到服务区，一方面要服务器同意，即指定Access-Control-Allow-Credentials字段，另一方面，必须在Ajax请求中打开withCredentials属性。两者缺一不可，否则即使服务器设置好了字段，浏览器也不会发送Cookie，或者服务器要设置Cookie，浏览器也不会处理。如果省略withCredentials，某些浏览器还是会发送Cookie，因此，如果不需要，可以显式的关闭withCredentials。

需要注意的是，如果要发生Cookie，Access-Control-Allow-Credentials就不能设为*，必须指定明确的、与请求网页一致的源。同时，Cookie依然遵循同源策略，只有服务器源设置的Cookie才会上传，其他源设置的Cookie并不会上传，且跨源网页代码中的document.cookie也无法读取服务器源下的cookie。

(3) Access-Control-Expose-Headers

该字段可选。CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果想要拿到其他字段，就必须在此字段里面指定。

### 四、非简单请求

### 4.1 预检请求

非简单请求是那种对服务器有特殊要求的的请求，比如请求方法是PUT或DELETE，或者Content-Type字段类型是application/json等。常见的请求一般只会手动设置Content-Type字段，因此只要其值不为指定的三种类型，就成为非简单请求。

CORS请求的非简单请求，会在正式通信之前，增加一次HTTP查询请求，即预检请求。

浏览器会先询问服务器，当前网页所在的源是否在服务器的许可名单之中，以及可以使用哪些HTTP方法和头部字段。只有得到肯定的答复，浏览器才会发出正式的Ajax请求，否则就报错。

下面是一段浏览器的javascript脚本：

```js
var url = 'https://www.1958xy.com'
var xhr = new XMLHttpRequest()
xhr.open('PUT', url, true)
xhr.setRequestHeader('X-Custom-Header', 'value')
xhr.end()
```
上面的代码中，HTTP请求的方法是PUT，并且发送了一个自定义头信息X-Custom_Header。浏览器发现这是一个非简单请求，就自动发出一个预检请求，要求服务器确认是否可以这样请求。下面是预检请求的HTTP头信息：

```http
OPTIONS /cors HTTP/1.1
Origin: https://www.1958xy.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
Host: www.1958.com
Accept-Language: en_US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

预检请求用的请求方法是OPTIONS，表示这个请求是用来询问的，头信息里面，关键字段是Origin，表示请求来自哪个源。除了Origin字段，预检请求头信息包括两个特殊字段：

(1) Access-Control-Request-Method

该字段是必须的。用来列出浏览器的CORS请求会用到哪些请求方法。

(2) Access-Control-Request-Headers

该字段是一个逗号分隔的字符串，指定浏览器CORS请求会额外发送的头信息字段，上例是X-Custom-Header。

### 4.2 预检请求的响应

服务器在收到预检请求后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出响应：

```http
HTTP/1.1 200 ok
Date: Mon, 01 Dec 2008 01:15:39 GMT
Access-Control-Allow-Origin: https://www.1958xy.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 1728000
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive

```

上面的HTTP回应中，关键的是Access-Control-Allow-Origin字段，表示https://www.1958xy.com可以请求数据。该字段也可以设为星号，表示同意任意跨源请求。

如果服务器否定了"预检"请求，会返回一个正常的HTTP回应，但是没有任何CORS相关的头信息字段。这时，浏览器就会认定，服务器不同意预检请求，因此触发一个错误，被XMLHttpRequest对象的onerror回调函数捕获。控制台会打印出如下的报错信息。

```http
XMLHttpRequest cannot load http://api.alice.com.
Origin https://www.1958xy.com is not allowed by Access-Control-Allow-Origin.
```

其他的CORS响应字段：

（1）Access-Control-Allow-Methods

该字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。

（2）Access-Control-Allow-Headers

如果浏览器请求包括Access-Control-Request-Headers字段，则Access-Control-Allow-Headers字段是必需的，否则可选。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段。

（3）Access-Control-Allow-Credentials

该字段可选。该字段与简单请求时的含义相同。

（4）Access-Control-Max-Age

该字段可选，用来指定本次预检请求的有效期，单位为秒。上面结果中，有效期是20天（1728000秒），即允许缓存该条回应1728000秒（即20天），在此期间，不用发出另一条预检请求。


### 4.3 浏览器的正常请求和回应

一旦服务器通过了"预检"请求，以后每次浏览器正常的CORS请求，就都跟简单请求一样，会有一个Origin头信息字段。服务器的回应，也都会有一个Access-Control-Allow-Origin头信息字段。

下面是"预检"请求之后，浏览器的正常CORS请求。

```http
PUT /cors HTTP/1.1
Origin: https://www.1958xy.com
Host: api.alice.com
X-Custom-Header: value
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```
上面头信息的Origin字段是浏览器自动添加的。

下面是服务器正常的回应。

```http
Access-Control-Allow-Origin: https://www.1958xy.com
Content-Type: text/html; charset=utf-8
```

上面头信息中，Access-Control-Allow-Origin字段是每次回应都必定包含的。

## 五、与JSONP的比较

CORS与JSONP的使用目的相同，但是比JSONP更强大。

JSONP只支持GET请求，CORS支持所有类型的HTTP请求。JSONP的优势在于支持老式浏览器，以及可以向不支持CORS的网站请求数据。