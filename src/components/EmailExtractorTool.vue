<template>
  <div>
    <h1>Urls and Email Extractor Online</h1>
    <a href="https://github.com/kevincobain2000/email-extractor-online" title="https://github.com/kevincobain2000/email-extractor-online">
      https://github.com/kevincobain2000/email-extractor-online
    </a>
    <p>
      Extract urls and email addresses by crawling website. Online Tool.
      <br> An algorithm that extracts urls and email addresses from any website.
    </p>
    <h3>Input url</h3>
    <br>
    <input @keydown="resetResult" v-model="urlText" placeholder="Enter your url">
    &nbsp; <button v-on:click="extractEmails" class="btn btn-sm btn-primary text-white" type="button">Extract Emails</button>

    <p>
      <span v-if="error" class="error">{{error}}</span>
    </p>

    <p>
        <small>Number of urls to crawl</small>&nbsp;
        <select v-model="limit">
          <option>10</option>
          <option>20</option>
          <option>50</option>
          <option>100</option>
          <option>200</option>
          <option>500</option>
          <option>1000</option>
          <option>5000</option>
        </select>
    </p>
    <table v-if="crawledUrls.length">
      <caption><strong>Results</strong></caption>
      <tbody>
        <tr v-for="url,idx in urls">
          <td width="5%" align="center">
            <small>{{idx+1}}.</small>
          </td>
          <td width="40%">
            <code><a class="crawled-url" :href="url" target="_blank" :title="url">{{truncate(url, 100)}}</a></code>
          </td>
          <td width="55%">
            <div v-for="email in urlEmails[url]">
              <strong><code>{{email}}</code></strong>
            </div>
            <div v-if="urlEmails[url] == null">
              <img src="../assets/loading.svg" alt="loading" height="30" width="50">
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <footer>
      <h3>Credits</h3>
      <ul>
        <li><a href="https://github.com/Rob--W/cors-anywhere/" target="_blank" rel="noopener">Cors Anywhere</a></li>
      </ul>
    </footer>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: 'EmailExtractorTool',
  props: {
  },
  data() {
    return {
      error: null,
      limit: 1000,
      urlText: 'http://www.mit.edu/',
      urls: [],
      crawledUrls: [],
      urlEmails: {},
    }
  },
  methods: {
    resetResult: function() {
      this.error = null
    },
    truncate(string, length){
      return _.truncate(string, {'length': length})
    },
    extractEmails: function() {
      this.__initUrls()
      this.__crawlUrls()
    },
    __extractEmails(url) {
      if (this.urlEmails[url]) {
        return
      }
      if (this.urls.includes(url) || this.urls.length > this.limit) {
        this.urlEmails[url] = []
        return
      }

      this.urls.push(url)
      this.$http
        .get(this.__addCors(url))
        .then(response => {
          let text = response.data
          this.urlEmails[url] = _.uniq(this.__matchEmails(text))
          this.__crawlUrls()
        })
    },
    __matchEmails(text) {
      let emails = []
      let matched = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)
      if (!matched) {
        return emails
      }
      for (var i = 0; i < matched.length; i++) {
        let email = _.trim(matched[i])
        if (this.__isValidEmail(email)) {
          emails.push(email)
        }
      }
      return emails
    },
    __isValidEmail(email) {
      return ! (_.endsWith(email, '.png')
        || _.endsWith(email, '.jpg')
        || _.endsWith(email, '.svg')
        || _.endsWith(email, '.ico'))
    },
    __initUrls() {
      this.crawledUrls = []
      this.urls = this.urlText.split('\n')
    },
    __crawlUrls() {
      for (let url of this.urls) {
        if (this.crawledUrls.includes(url)) {
          continue
        }
        this.crawledUrls.push(url)
        this.$http
          .get(this.__addCors(url))
          .then(response => {
            let doc = response.data
            var links = $('a', doc);
            this.__processUrls(url, links)
          })
      }
    },
    __addCors(url) {
      return 'https://cors-anywhere.herokuapp.com/' + url
    },
    __processUrls(url, links) {
      for (let link of links) {
        if (this.__hostname(url) != this.__hostname(link.href)) {
          continue;
        }
        this.__extractEmails(link.href)
      }
    },
    __hostname(url) {
        var hostname;
        //find & remove protocol (http, ftp, etc.) and get hostname

        if (url.indexOf("//") > -1) {
            hostname = url.split('/')[2];
        } else {
            hostname = url.split('/')[0];
        }

        hostname = hostname.split(':')[0];
        hostname = hostname.split('?')[0];
        return hostname;
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table{
    margin-left: auto;
    margin-right: auto;
    table-layout: fixed;
    border: 1px solid #dfd2d2;
    border-collapse: collapse;
    text-align: left;
    width:70%;
}
td{
    border: 1px solid #dfd2d2;
    padding: 3px;
    word-break: break-all;
}
input:active, input:focus, input:hover{
  outline:0px !important;
  -webkit-appearance:none;
  border: 3px solid #bab6b6;
}
input {
  padding:10px;
  border: 3px solid lightgray;
  border-radius: 4px;
  min-width: 320px;
  font-size:13px;
  font-family:monospace;
  margin-bottom:10px;
}
pre{
  margin:30px;
  overflow-x: auto;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}
footer {
  margin-top:200px;
}
@media all{
.btn{-moz-appearance:none;-moz-user-select:none;-ms-user-select:none;-webkit-appearance:none;-webkit-user-select:none;appearance:none;background-position:-1px -1px;background-repeat:repeat-x;background-size:110% 110%;border:1px solid rgba(27,31,35,.2);border-radius:.25em;cursor:pointer;display:inline-block;font-size:14px;font-weight:600;line-height:20px;padding:6px 12px;position:relative;user-select:none;vertical-align:middle;white-space:nowrap;}
.btn:hover{background-repeat:repeat-x;text-decoration:none;}
.btn:focus{outline:0;}
.btn:disabled{background-position:0 0;cursor:default;}
.btn:active{background-image:none;}
.btn{background-color:#eff3f6;background-image:linear-gradient(-180deg,#fafbfc,#eff3f6 90%);color:#24292e;}
.btn:focus{box-shadow:0 0 0 .2em rgba(3,102,214,.3);}
.btn:hover{background-color:#e6ebf1;background-image:linear-gradient(-180deg,#f0f3f6,#e6ebf1 90%);background-position:-.5em;border-color:rgba(27,31,35,.35);}
.btn:active{background-color:#e9ecef;background-image:none;border-color:rgba(27,31,35,.35);box-shadow:inset 0 .15em .3em rgba(27,31,35,.15);}
.btn:disabled{background-color:#eff3f6;background-image:none;border-color:rgba(27,31,35,.2);box-shadow:none;color:rgba(36,41,46,.4);}
.btn-primary{background-color:#28a745;background-image:linear-gradient(-180deg,#34d058,#28a745 90%);color:#fff;}
.btn-primary:focus{box-shadow:0 0 0 .2em rgba(52,208,88,.4);}
.btn-primary:hover{background-color:#269f42;background-image:linear-gradient(-180deg,#2fcb53,#269f42 90%);background-position:-.5em;border-color:rgba(27,31,35,.5);}
.btn-primary:active{background-color:#279f43;background-image:none;border-color:rgba(27,31,35,.5);box-shadow:inset 0 .15em .3em rgba(27,31,35,.15);}
.btn-primary:disabled{background-color:#94d3a2;background-image:none;border-color:rgba(27,31,35,.2);box-shadow:none;color:hsla(0,0%,100%,.75);}
.btn-sm{font-size:12px;line-height:20px;padding:3px 10px;}
:-ms-input-placeholder{color:#6a737d;}
::-ms-input-placeholder{color:#6a737d;}
::placeholder{color:#6a737d;}
.text-white{color:#fff!important;}
}
@media all{
@media print{
.btn:not(.btn-outline){background:none;color:#24292e!important;}
}
}
h3 {
  margin-top: 40px;
  margin-bottom: -5px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.error {
  color: red;
}
a.crawled-url{
  color: #609;
}

</style>
