<template>
  <div id="main">
    <a href="https://github.com/alza54/steam-text-center-tool" class="github-corner" aria-label="View source on GitHub"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#fff; color:#151513; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a>
    <Logo class="animated pulse"></Logo>
    <Shellcode class="animated pulse"></Shellcode>
    <quill-editor
      v-bind:style="{ 'max-width': width + 'px' }"
      ref="mainQuill"
      class="center-text-box" v-model="editor" :options="editorOptions"
      @change="update">
    </quill-editor>
    <div class="flex-inline">
      <select class="gray_bevel" @change="changeMode">
        <option value="592">{{ $t("modes.textShowcaseCenter") }}</option>
        <option value="626">{{ $t("modes.groupSummaryCenter") }}</option>
        <option value="544">{{ $t("modes.profileCommentCenter") }}</option>
        <option value="534">{{ $t("modes.groupCommentCenter") }}</option>
        <option value="454">{{ $t("modes.summaryCenter") }}</option>
      </select>
      <a class="btn_profile_action btn_medium" href="#" @click="reset">
        <span>{{ $t("reset") }}</span>
      </a>
      <a class="btn_profile_action btn_medium" href="#" @click="copy">
        <span>{{ $t("copy") }}</span>
      </a>
      <a class="btn_profile_action btn_medium" href="#" @click="centerText">
  			<span>{{ $t("center") }}</span>
  		</a>
    </div>
    <modal transition="scale" height="auto" width="80%" :max-width="832" adaptive name="donate-modal">
      <img style="width:100%;height:auto;" src="/static/donate.png"/>
      <div class="donate-buttons">PayPal</div>
    </modal>
  </div>
</template>

<script>

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import { quillEditor } from 'vue-quill-editor';

import Quill from 'quill';
const Embed = Quill.import('blots/embed');

class QuillPrecision extends Embed {
  static create (value) {
    let node = super.create(value);
    node.innerHTML = `<span contenteditable=false>${value}%</span>`;
    // (${value > 100 ? (value - 100).toFixed(2) + '% to right' : (100 - value).toFixed(2) + '% to left'})
    node.setAttribute('title', `Precision`);
    return node;
  }
}

QuillPrecision.blotName = 'precision';
QuillPrecision.className = 'quill-precision';
QuillPrecision.tagName = 'span';

Quill.register({
  'formats/precision': QuillPrecision
});

import Logo from './Logo.vue';
import Shellcode from './Shellcode.vue';

export default {
  components: { Logo, Shellcode, Quill, quillEditor },
  name: 'main',
  data () {
    return {

      textCentered: false,
      width: '592',

      editor: '',
      editorOptions: {
        placeholder: this.$t("placeholder"),
        formats: [
          'bold', 'italic', 'strike', 'underline', 'header', 'image', 'precision'
        ],
        modules: {
          clipboard: {
            matchers: [
              [ Node.ELEMENT_NODE, (node, delta) => {
                delta.ops = delta.ops.map(op => {
                  if (op.insert.image) {
                    if (op.insert.image.indexOf('https://steamcommunity-a.akamaihd.net/economy/emoticon/') !== 0) {
                      return { insert: {} };
                    }
                  }
                  return { insert: op.insert };
                })
                return delta
              }]
            ],
            matchVisual: false
          },
          toolbar: [
            ['bold', 'italic', 'strike', 'underline'],
            [{ header: 1 }],
            ['clean']
          ]
        }
      }
    }
  },
  methods: {

    copy () {

      var decodeEntities = (function () {
        // this prevents any overhead from creating the object each time
        var element = document.createElement('div');

        function decodeHTMLEntities (str) {
          if(str && typeof str === 'string') {
            // strip script/html tags
            str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
            str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
          }

          return str;
        }

        return decodeHTMLEntities;
      })();

      var output = this.editor;
      output = output.replace(/&nbsp;/g, ' ');
      output = output.replace(/<h1>/g, '[h1]').replace(/<\/h1>/g, '[/h1]\n');
      output = output.replace(/<p>/g, '').replace(/<\/p>/g, '\n');
      output = output.replace(/<strong>/g, '[b]').replace(/<\/strong>/g, '[/b]');
      output = output.replace(/<em>/g, '[i]').replace(/<\/em>/g, '[/i]');
      output = output.replace(/<u>/g, '[u]').replace(/<\/u>/g, '[/u]');
      output = output.replace(/<s>/g, '[strike]').replace(/<\/s>/g, '[/strike]');
      output = output.replace(/<br>/g, '\n');
      output = output.replace(/<span class="quill-precision" title="Precision">﻿<span contenteditable="false"><span contenteditable="false">[0-9]*\.[0-9]*%<\/span><\/span>﻿<\/span>/g, '');
      var r = /<img src="https:\/\/steamcommunity-a\.akamaihd\.net\/economy\/emoticon\/(\w+)">/g;
      output = output.replace(r, `:$1:`);
      output = decodeEntities(output);
      this.$copyText(output).then(e => {
        alert(this.$t('copied'));
      }, e => {
        alert(this.$t('cannotCopy'));
      });
      if (this.textCentered && !localStorage.getItem('donate-modal')) {
        // this.$modal.show('donate-modal');
        // localStorage.setItem('donate-modal', true);
      }
    },

    reset () {
      this.editor = '';
    },

    parseForPrecision () {
      // This instead of getText() because we have emoticons
      var output = this.editor;
      output = output.replace(/&nbsp;/g, ' ');
      output = output.replace(/<h1>/g, '').replace(/<\/h1>/g, '\n');
      output = output.replace(/<p>/g, '').replace(/<\/p>/g, '\n');
      output = output.replace(/<strong>/g, '').replace(/<\/strong>/g, '');
      output = output.replace(/<em>/g, '').replace(/<\/em>/g, '');
      output = output.replace(/<u>/g, '').replace(/<\/u>/g, '');
      output = output.replace(/<s>/g, '').replace(/<\/s>/g, '');
      output = output.replace(/<br>/g, '\n');
      var r = /<img src="https:\/\/steamcommunity-a\.akamaihd\.net\/economy\/emoticon\/(\w+)">/g;
      output = output.replace(r, `e`); // single character because image is embed
      return output;
    },

    insertPrecision (precision) {
      var quill = this.$refs.mainQuill.quill, editor = this.parseForPrecision();
      var lines = editor.split('\n'); lines.pop();
      var insertEmbed = (offset, value) => quill.insertEmbed(offset, 'precision', value);
      var i = 0;
      lines.forEach(function (line, index) {
        if (lines.indexOf(line) != index) {
          return;
        } else if (line === 'Unexpected error happened while trying to center this line. Please try again.') {
          return;
        } else if (line === '*THIS LINE WAS TOO WIDE*') {
          return;
        } else {
          insertEmbed(editor.indexOf(line) + i + line.length, precision[i].prec);
          i++;
        }
      });
    },

    centerText () {
      this.$http.post('/api/text/center', { text: this.editor, width: this.width })
        .then(data => {
          if (data.data.success) {
            this.editor = data.data.response;
            setTimeout(this.insertPrecision, 100, data.data.precision);
            this.textCentered = true;
          } else {
            alert(data.data.error);
          }
        });
    },

    changeMode (e) {
      this.width = e.target.value;
    },

    update (e) {

      // Quill embeds are buggy...
      // var selector = '.ql-editor img:not([src^="https://steamcommunity-a.akamaihd.net/economy/emoticon/"])';
      // document.querySelectorAll(selector).forEach(e => e.outerHTML = '');

      var generateEmoticon = function (e) {
        e = e.replace(/:| /g, '');
        return `<img src="https://steamcommunity-a.akamaihd.net/economy/emoticon/${e}">&#160;`;
      }

      if (e.html.match(/:\w{1,}: /g)) {
        e.html.match(/:\w{1,}: /g).forEach(o => {
          this.editor = e.html.replace(o, generateEmoticon(o));
        })
      }

    }

  },
  mounted () {
    this.$root.$on('loaded', () => {
      window.addEventListener("beforeunload", function (e) {
        var confirmationMessage = this.$t('confirmationMessage');
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
      });
      this.$el.className = 'loaded';
      this.$refs.mainQuill.quill.root.setAttribute('data-placeholder', this.$t('placeholder'));
      if (!localStorage.getItem('intro-toast')) {
        this.$toasted.show(this.$t('emoticonsSupported'), {
          action: {
            text: this.$t('howToUse'),
            onClick: (e, toastObject) => {
              toastObject.goAway(0);
              this.$toasted.show(this.$t('instructions.one'));
              this.$toasted.show(this.$t('instructions.two'));
            }
          }
        });
        localStorage.setItem('intro-toast', true);
      }
    });
  }, i18n: {
    messages: {
      "en": {
        "modes": {
          "textShowcaseCenter": "Text Showcase Center",
          "groupSummaryCenter": "Group Summary Center",
          "profileCommentCenter": "Profile Comment Center",
          "groupCommentCenter": "Group Comment Center",
          "summaryCenter": "Summary Center"
        },
        "reset": "Reset",
        "copy": "Copy",
        "center": "Center my text",
        "placeholder": "Insert some text...",
        "emoticonsSupported": "Emoticons are supported.",
        "howToUse": "How to use?",
        "instructions": {
          "one": "Simply type :[name]: and press space.",
          "two": "Text will be automatically replaced with an emoticon."
        },
        "confirmationMessage": "If you leave the page, your text will be lost.",
        "copied": "Copied",
        "cannotCopy": "Cannot copy"
      },
      "pl": {
        "modes": {
          "textShowcaseCenter": "Gablota tekstowa",
          "groupSummaryCenter": "Podsumowanie	grupy",
          "profileCommentCenter": "Komentarz na profilu",
          "groupCommentCenter": "Komentarz w grupie",
          "summaryCenter": "Podsumowanie"
        },
        "reset": "Resetuj",
        "copy": "Kopiuj",
        "center": "Wyśrodkuj",
        "placeholder": "Wpisz jakiś tekst...",
        "emoticonsSupported": "Emotikony są wspierane.",
        "howToUse": "Jak ich używać?",
        "instructions": {
          "one": "Po prostu napisz :[nazwa]: i naciśnij spację.",
          "two": "Tekst zostanie automatycznie zastąpiony emotikoną."
        },
        "confirmationMessage": "Jeśli opuścisz tą stronę, twój tekst zostanie utracony.",
        "copied": "Skopiowano",
        "cannotCopy": "Nie można skopiować"
      }
    }
  }
};

</script>

<style lang="scss" scoped>

  #main {
    display: flex;
    flex-direction: column;
    color: $white;
    font-family: futura-pt, sans-serif;
    font-weight: 400;
    font-style: normal;
  }

  #main:not(.loaded) {
    display: none;
  }

  #main svg#logo, #main svg#Shellcode {
    fill: $white;
    width: 100%;
    align-self: center;
  }

  #main svg#logo {
    max-width: 150px;
    margin-left: 25px;
  }

  #main svg#Shellcode {
    max-width: 100px;
    height: 30px;
  }

  #main p {
    text-align: center;
  }

  .center-text-box {
    font-family: Arial, Helvetica, Verdana, sans-serif;
    font-size: 13px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    width: 90vw;
    height: 50vh;
    margin: 10px 0;
    border: none;
    background: #0B0B0B;
    overflow-y: hidden;
    align-self: center;
  }

  .flex-inline {
    display: flex;
    flex-wrap: wrap;
    max-width: 90vw;
  }

  .donate-buttons {
    position: absolute;
    right: 25%;
    bottom: 10%;
  }

  // Steam

  img.emoticon {
    vertical-align: text-bottom;
    height: 18px;
    width: 18px;
  }

  select.gray_bevel, .btn_profile_action {
    height: 35px;
    margin: 0 .4em .4em 0;
    border-radius: .12em;
    box-sizing: border-box;
    text-decoration: none;
    font-family: roboto, sans-serif;
    font-weight: 300;
    color: #fff;
    text-align: center;
    transition: all .2s;
    outline: none;
  }

  select.gray_bevel {
    padding: 0 .1em .1em 1em;
    border: .15em solid #fff;
    background: none;
    font-size: .9em;
  }

  select.gray_bevel option {
    background: $licorice;
  }

  .btn_profile_action:hover {
    color: #000;
    background: #fff;
  }

  .btn_profile_action {
    padding: .25em 1.2em;
    border: .13em solid #fff;
  }

  .github-corner:hover .octo-arm {
    animation: octocat-wave 560ms ease-in-out;
  }

  @keyframes octocat-wave {
    0%, 100% {
      transform: rotate(0);
    }
    20%, 60% {
      transform: rotate(-25deg);
    }
    40%, 80% {
      transform: rotate(10deg);
    }
  }

  @media (max-width:500px) {
    .github-corner:hover .octo-arm {
      animation: none;
    }
    .github-corner .octo-arm {
      animation: octocat-wave 560ms ease-in-out;
    }
  }

  @media all and (min-width: 600px) {
    .btn_profile_action:nth-of-type(1) {
      margin-left: auto;
    }
  }

  @media all and (max-height: 710px) {
    #logo {
      margin-top: 10px;
    }
  }

</style>
