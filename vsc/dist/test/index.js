"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/escape-string-regexp/index.js
var require_escape_string_regexp = __commonJS({
  "node_modules/escape-string-regexp/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (string) => {
      if (typeof string !== "string") {
        throw new TypeError("Expected a string");
      }
      return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
    };
  }
});

// node_modules/diff/lib/diff/base.js
var require_base = __commonJS({
  "node_modules/diff/lib/diff/base.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = Diff;
    function Diff() {
    }
    Diff.prototype = {
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      diff: function diff(oldString, newString) {
        var _options$timeout;
        var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var callback = options.callback;
        if (typeof options === "function") {
          callback = options;
          options = {};
        }
        var self2 = this;
        function done(value) {
          value = self2.postProcess(value, options);
          if (callback) {
            setTimeout(function() {
              callback(value);
            }, 0);
            return true;
          } else {
            return value;
          }
        }
        oldString = this.castInput(oldString, options);
        newString = this.castInput(newString, options);
        oldString = this.removeEmpty(this.tokenize(oldString, options));
        newString = this.removeEmpty(this.tokenize(newString, options));
        var newLen = newString.length, oldLen = oldString.length;
        var editLength = 1;
        var maxEditLength = newLen + oldLen;
        if (options.maxEditLength != null) {
          maxEditLength = Math.min(maxEditLength, options.maxEditLength);
        }
        var maxExecutionTime = (
          /*istanbul ignore start*/
          (_options$timeout = /*istanbul ignore end*/
          options.timeout) !== null && _options$timeout !== void 0 ? _options$timeout : Infinity
        );
        var abortAfterTimestamp = Date.now() + maxExecutionTime;
        var bestPath = [{
          oldPos: -1,
          lastComponent: void 0
        }];
        var newPos = this.extractCommon(bestPath[0], newString, oldString, 0, options);
        if (bestPath[0].oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
          return done(buildValues(self2, bestPath[0].lastComponent, newString, oldString, self2.useLongestToken));
        }
        var minDiagonalToConsider = -Infinity, maxDiagonalToConsider = Infinity;
        function execEditLength() {
          for (var diagonalPath = Math.max(minDiagonalToConsider, -editLength); diagonalPath <= Math.min(maxDiagonalToConsider, editLength); diagonalPath += 2) {
            var basePath = (
              /*istanbul ignore start*/
              void 0
            );
            var removePath = bestPath[diagonalPath - 1], addPath = bestPath[diagonalPath + 1];
            if (removePath) {
              bestPath[diagonalPath - 1] = void 0;
            }
            var canAdd = false;
            if (addPath) {
              var addPathNewPos = addPath.oldPos - diagonalPath;
              canAdd = addPath && 0 <= addPathNewPos && addPathNewPos < newLen;
            }
            var canRemove = removePath && removePath.oldPos + 1 < oldLen;
            if (!canAdd && !canRemove) {
              bestPath[diagonalPath] = void 0;
              continue;
            }
            if (!canRemove || canAdd && removePath.oldPos < addPath.oldPos) {
              basePath = self2.addToPath(addPath, true, false, 0, options);
            } else {
              basePath = self2.addToPath(removePath, false, true, 1, options);
            }
            newPos = self2.extractCommon(basePath, newString, oldString, diagonalPath, options);
            if (basePath.oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
              return done(buildValues(self2, basePath.lastComponent, newString, oldString, self2.useLongestToken));
            } else {
              bestPath[diagonalPath] = basePath;
              if (basePath.oldPos + 1 >= oldLen) {
                maxDiagonalToConsider = Math.min(maxDiagonalToConsider, diagonalPath - 1);
              }
              if (newPos + 1 >= newLen) {
                minDiagonalToConsider = Math.max(minDiagonalToConsider, diagonalPath + 1);
              }
            }
          }
          editLength++;
        }
        if (callback) {
          (function exec() {
            setTimeout(function() {
              if (editLength > maxEditLength || Date.now() > abortAfterTimestamp) {
                return callback();
              }
              if (!execEditLength()) {
                exec();
              }
            }, 0);
          })();
        } else {
          while (editLength <= maxEditLength && Date.now() <= abortAfterTimestamp) {
            var ret = execEditLength();
            if (ret) {
              return ret;
            }
          }
        }
      },
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      addToPath: function addToPath(path2, added, removed, oldPosInc, options) {
        var last = path2.lastComponent;
        if (last && !options.oneChangePerToken && last.added === added && last.removed === removed) {
          return {
            oldPos: path2.oldPos + oldPosInc,
            lastComponent: {
              count: last.count + 1,
              added,
              removed,
              previousComponent: last.previousComponent
            }
          };
        } else {
          return {
            oldPos: path2.oldPos + oldPosInc,
            lastComponent: {
              count: 1,
              added,
              removed,
              previousComponent: last
            }
          };
        }
      },
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      extractCommon: function extractCommon(basePath, newString, oldString, diagonalPath, options) {
        var newLen = newString.length, oldLen = oldString.length, oldPos = basePath.oldPos, newPos = oldPos - diagonalPath, commonCount = 0;
        while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(oldString[oldPos + 1], newString[newPos + 1], options)) {
          newPos++;
          oldPos++;
          commonCount++;
          if (options.oneChangePerToken) {
            basePath.lastComponent = {
              count: 1,
              previousComponent: basePath.lastComponent,
              added: false,
              removed: false
            };
          }
        }
        if (commonCount && !options.oneChangePerToken) {
          basePath.lastComponent = {
            count: commonCount,
            previousComponent: basePath.lastComponent,
            added: false,
            removed: false
          };
        }
        basePath.oldPos = oldPos;
        return newPos;
      },
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      equals: function equals(left, right, options) {
        if (options.comparator) {
          return options.comparator(left, right);
        } else {
          return left === right || options.ignoreCase && left.toLowerCase() === right.toLowerCase();
        }
      },
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      removeEmpty: function removeEmpty(array) {
        var ret = [];
        for (var i = 0; i < array.length; i++) {
          if (array[i]) {
            ret.push(array[i]);
          }
        }
        return ret;
      },
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      castInput: function castInput(value) {
        return value;
      },
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      tokenize: function tokenize(value) {
        return Array.from(value);
      },
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      join: function join(chars) {
        return chars.join("");
      },
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      postProcess: function postProcess(changeObjects) {
        return changeObjects;
      }
    };
    function buildValues(diff, lastComponent, newString, oldString, useLongestToken) {
      var components = [];
      var nextComponent;
      while (lastComponent) {
        components.push(lastComponent);
        nextComponent = lastComponent.previousComponent;
        delete lastComponent.previousComponent;
        lastComponent = nextComponent;
      }
      components.reverse();
      var componentPos = 0, componentLen = components.length, newPos = 0, oldPos = 0;
      for (; componentPos < componentLen; componentPos++) {
        var component = components[componentPos];
        if (!component.removed) {
          if (!component.added && useLongestToken) {
            var value = newString.slice(newPos, newPos + component.count);
            value = value.map(function(value2, i) {
              var oldValue = oldString[oldPos + i];
              return oldValue.length > value2.length ? oldValue : value2;
            });
            component.value = diff.join(value);
          } else {
            component.value = diff.join(newString.slice(newPos, newPos + component.count));
          }
          newPos += component.count;
          if (!component.added) {
            oldPos += component.count;
          }
        } else {
          component.value = diff.join(oldString.slice(oldPos, oldPos + component.count));
          oldPos += component.count;
        }
      }
      return components;
    }
  }
});

// node_modules/diff/lib/diff/character.js
var require_character = __commonJS({
  "node_modules/diff/lib/diff/character.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.characterDiff = void 0;
    exports2.diffChars = diffChars;
    var _base = _interopRequireDefault(require_base());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var characterDiff = (
      /*istanbul ignore start*/
      exports2.characterDiff = /*istanbul ignore end*/
      new /*istanbul ignore start*/
      _base[
        /*istanbul ignore start*/
        "default"
        /*istanbul ignore end*/
      ]()
    );
    function diffChars(oldStr, newStr, options) {
      return characterDiff.diff(oldStr, newStr, options);
    }
  }
});

// node_modules/diff/lib/util/string.js
var require_string = __commonJS({
  "node_modules/diff/lib/util/string.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.hasOnlyUnixLineEndings = hasOnlyUnixLineEndings;
    exports2.hasOnlyWinLineEndings = hasOnlyWinLineEndings;
    exports2.longestCommonPrefix = longestCommonPrefix;
    exports2.longestCommonSuffix = longestCommonSuffix;
    exports2.maximumOverlap = maximumOverlap;
    exports2.removePrefix = removePrefix;
    exports2.removeSuffix = removeSuffix;
    exports2.replacePrefix = replacePrefix;
    exports2.replaceSuffix = replaceSuffix;
    function longestCommonPrefix(str1, str2) {
      var i;
      for (i = 0; i < str1.length && i < str2.length; i++) {
        if (str1[i] != str2[i]) {
          return str1.slice(0, i);
        }
      }
      return str1.slice(0, i);
    }
    function longestCommonSuffix(str1, str2) {
      var i;
      if (!str1 || !str2 || str1[str1.length - 1] != str2[str2.length - 1]) {
        return "";
      }
      for (i = 0; i < str1.length && i < str2.length; i++) {
        if (str1[str1.length - (i + 1)] != str2[str2.length - (i + 1)]) {
          return str1.slice(-i);
        }
      }
      return str1.slice(-i);
    }
    function replacePrefix(string, oldPrefix, newPrefix) {
      if (string.slice(0, oldPrefix.length) != oldPrefix) {
        throw Error(
          /*istanbul ignore start*/
          "string ".concat(
            /*istanbul ignore end*/
            JSON.stringify(string),
            " doesn't start with prefix "
          ).concat(JSON.stringify(oldPrefix), "; this is a bug")
        );
      }
      return newPrefix + string.slice(oldPrefix.length);
    }
    function replaceSuffix(string, oldSuffix, newSuffix) {
      if (!oldSuffix) {
        return string + newSuffix;
      }
      if (string.slice(-oldSuffix.length) != oldSuffix) {
        throw Error(
          /*istanbul ignore start*/
          "string ".concat(
            /*istanbul ignore end*/
            JSON.stringify(string),
            " doesn't end with suffix "
          ).concat(JSON.stringify(oldSuffix), "; this is a bug")
        );
      }
      return string.slice(0, -oldSuffix.length) + newSuffix;
    }
    function removePrefix(string, oldPrefix) {
      return replacePrefix(string, oldPrefix, "");
    }
    function removeSuffix(string, oldSuffix) {
      return replaceSuffix(string, oldSuffix, "");
    }
    function maximumOverlap(string1, string2) {
      return string2.slice(0, overlapCount(string1, string2));
    }
    function overlapCount(a, b) {
      var startA = 0;
      if (a.length > b.length) {
        startA = a.length - b.length;
      }
      var endB = b.length;
      if (a.length < b.length) {
        endB = a.length;
      }
      var map = Array(endB);
      var k = 0;
      map[0] = 0;
      for (var j = 1; j < endB; j++) {
        if (b[j] == b[k]) {
          map[j] = map[k];
        } else {
          map[j] = k;
        }
        while (k > 0 && b[j] != b[k]) {
          k = map[k];
        }
        if (b[j] == b[k]) {
          k++;
        }
      }
      k = 0;
      for (var i = startA; i < a.length; i++) {
        while (k > 0 && a[i] != b[k]) {
          k = map[k];
        }
        if (a[i] == b[k]) {
          k++;
        }
      }
      return k;
    }
    function hasOnlyWinLineEndings(string) {
      return string.includes("\r\n") && !string.startsWith("\n") && !string.match(/[^\r]\n/);
    }
    function hasOnlyUnixLineEndings(string) {
      return !string.includes("\r\n") && string.includes("\n");
    }
  }
});

// node_modules/diff/lib/diff/word.js
var require_word = __commonJS({
  "node_modules/diff/lib/diff/word.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.diffWords = diffWords;
    exports2.diffWordsWithSpace = diffWordsWithSpace;
    exports2.wordWithSpaceDiff = exports2.wordDiff = void 0;
    var _base = _interopRequireDefault(require_base());
    var _string = require_string();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var extendedWordChars = "a-zA-Z0-9_\\u{C0}-\\u{FF}\\u{D8}-\\u{F6}\\u{F8}-\\u{2C6}\\u{2C8}-\\u{2D7}\\u{2DE}-\\u{2FF}\\u{1E00}-\\u{1EFF}";
    var tokenizeIncludingWhitespace = new RegExp(
      /*istanbul ignore start*/
      "[".concat(
        /*istanbul ignore end*/
        extendedWordChars,
        "]+|\\s+|[^"
      ).concat(extendedWordChars, "]"),
      "ug"
    );
    var wordDiff = (
      /*istanbul ignore start*/
      exports2.wordDiff = /*istanbul ignore end*/
      new /*istanbul ignore start*/
      _base[
        /*istanbul ignore start*/
        "default"
        /*istanbul ignore end*/
      ]()
    );
    wordDiff.equals = function(left, right, options) {
      if (options.ignoreCase) {
        left = left.toLowerCase();
        right = right.toLowerCase();
      }
      return left.trim() === right.trim();
    };
    wordDiff.tokenize = function(value) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var parts;
      if (options.intlSegmenter) {
        if (options.intlSegmenter.resolvedOptions().granularity != "word") {
          throw new Error('The segmenter passed must have a granularity of "word"');
        }
        parts = Array.from(options.intlSegmenter.segment(value), function(segment) {
          return (
            /*istanbul ignore end*/
            segment.segment
          );
        });
      } else {
        parts = value.match(tokenizeIncludingWhitespace) || [];
      }
      var tokens = [];
      var prevPart = null;
      parts.forEach(function(part) {
        if (/\s/.test(part)) {
          if (prevPart == null) {
            tokens.push(part);
          } else {
            tokens.push(tokens.pop() + part);
          }
        } else if (/\s/.test(prevPart)) {
          if (tokens[tokens.length - 1] == prevPart) {
            tokens.push(tokens.pop() + part);
          } else {
            tokens.push(prevPart + part);
          }
        } else {
          tokens.push(part);
        }
        prevPart = part;
      });
      return tokens;
    };
    wordDiff.join = function(tokens) {
      return tokens.map(function(token, i) {
        if (i == 0) {
          return token;
        } else {
          return token.replace(/^\s+/, "");
        }
      }).join("");
    };
    wordDiff.postProcess = function(changes, options) {
      if (!changes || options.oneChangePerToken) {
        return changes;
      }
      var lastKeep = null;
      var insertion = null;
      var deletion = null;
      changes.forEach(function(change) {
        if (change.added) {
          insertion = change;
        } else if (change.removed) {
          deletion = change;
        } else {
          if (insertion || deletion) {
            dedupeWhitespaceInChangeObjects(lastKeep, deletion, insertion, change);
          }
          lastKeep = change;
          insertion = null;
          deletion = null;
        }
      });
      if (insertion || deletion) {
        dedupeWhitespaceInChangeObjects(lastKeep, deletion, insertion, null);
      }
      return changes;
    };
    function diffWords(oldStr, newStr, options) {
      if (
        /*istanbul ignore start*/
        /*istanbul ignore end*/
        (options === null || options === void 0 ? void 0 : options.ignoreWhitespace) != null && !options.ignoreWhitespace
      ) {
        return diffWordsWithSpace(oldStr, newStr, options);
      }
      return wordDiff.diff(oldStr, newStr, options);
    }
    function dedupeWhitespaceInChangeObjects(startKeep, deletion, insertion, endKeep) {
      if (deletion && insertion) {
        var oldWsPrefix = deletion.value.match(/^\s*/)[0];
        var oldWsSuffix = deletion.value.match(/\s*$/)[0];
        var newWsPrefix = insertion.value.match(/^\s*/)[0];
        var newWsSuffix = insertion.value.match(/\s*$/)[0];
        if (startKeep) {
          var commonWsPrefix = (
            /*istanbul ignore start*/
            (0, /*istanbul ignore end*/
            /*istanbul ignore start*/
            _string.longestCommonPrefix)(oldWsPrefix, newWsPrefix)
          );
          startKeep.value = /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _string.replaceSuffix)(startKeep.value, newWsPrefix, commonWsPrefix);
          deletion.value = /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _string.removePrefix)(deletion.value, commonWsPrefix);
          insertion.value = /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _string.removePrefix)(insertion.value, commonWsPrefix);
        }
        if (endKeep) {
          var commonWsSuffix = (
            /*istanbul ignore start*/
            (0, /*istanbul ignore end*/
            /*istanbul ignore start*/
            _string.longestCommonSuffix)(oldWsSuffix, newWsSuffix)
          );
          endKeep.value = /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _string.replacePrefix)(endKeep.value, newWsSuffix, commonWsSuffix);
          deletion.value = /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _string.removeSuffix)(deletion.value, commonWsSuffix);
          insertion.value = /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _string.removeSuffix)(insertion.value, commonWsSuffix);
        }
      } else if (insertion) {
        if (startKeep) {
          insertion.value = insertion.value.replace(/^\s*/, "");
        }
        if (endKeep) {
          endKeep.value = endKeep.value.replace(/^\s*/, "");
        }
      } else if (startKeep && endKeep) {
        var newWsFull = endKeep.value.match(/^\s*/)[0], delWsStart = deletion.value.match(/^\s*/)[0], delWsEnd = deletion.value.match(/\s*$/)[0];
        var newWsStart = (
          /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _string.longestCommonPrefix)(newWsFull, delWsStart)
        );
        deletion.value = /*istanbul ignore start*/
        (0, /*istanbul ignore end*/
        /*istanbul ignore start*/
        _string.removePrefix)(deletion.value, newWsStart);
        var newWsEnd = (
          /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _string.longestCommonSuffix)(
            /*istanbul ignore start*/
            (0, /*istanbul ignore end*/
            /*istanbul ignore start*/
            _string.removePrefix)(newWsFull, newWsStart),
            delWsEnd
          )
        );
        deletion.value = /*istanbul ignore start*/
        (0, /*istanbul ignore end*/
        /*istanbul ignore start*/
        _string.removeSuffix)(deletion.value, newWsEnd);
        endKeep.value = /*istanbul ignore start*/
        (0, /*istanbul ignore end*/
        /*istanbul ignore start*/
        _string.replacePrefix)(endKeep.value, newWsFull, newWsEnd);
        startKeep.value = /*istanbul ignore start*/
        (0, /*istanbul ignore end*/
        /*istanbul ignore start*/
        _string.replaceSuffix)(startKeep.value, newWsFull, newWsFull.slice(0, newWsFull.length - newWsEnd.length));
      } else if (endKeep) {
        var endKeepWsPrefix = endKeep.value.match(/^\s*/)[0];
        var deletionWsSuffix = deletion.value.match(/\s*$/)[0];
        var overlap = (
          /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _string.maximumOverlap)(deletionWsSuffix, endKeepWsPrefix)
        );
        deletion.value = /*istanbul ignore start*/
        (0, /*istanbul ignore end*/
        /*istanbul ignore start*/
        _string.removeSuffix)(deletion.value, overlap);
      } else if (startKeep) {
        var startKeepWsSuffix = startKeep.value.match(/\s*$/)[0];
        var deletionWsPrefix = deletion.value.match(/^\s*/)[0];
        var _overlap = (
          /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _string.maximumOverlap)(startKeepWsSuffix, deletionWsPrefix)
        );
        deletion.value = /*istanbul ignore start*/
        (0, /*istanbul ignore end*/
        /*istanbul ignore start*/
        _string.removePrefix)(deletion.value, _overlap);
      }
    }
    var wordWithSpaceDiff = (
      /*istanbul ignore start*/
      exports2.wordWithSpaceDiff = /*istanbul ignore end*/
      new /*istanbul ignore start*/
      _base[
        /*istanbul ignore start*/
        "default"
        /*istanbul ignore end*/
      ]()
    );
    wordWithSpaceDiff.tokenize = function(value) {
      var regex = new RegExp(
        /*istanbul ignore start*/
        "(\\r?\\n)|[".concat(
          /*istanbul ignore end*/
          extendedWordChars,
          "]+|[^\\S\\n\\r]+|[^"
        ).concat(extendedWordChars, "]"),
        "ug"
      );
      return value.match(regex) || [];
    };
    function diffWordsWithSpace(oldStr, newStr, options) {
      return wordWithSpaceDiff.diff(oldStr, newStr, options);
    }
  }
});

// node_modules/diff/lib/util/params.js
var require_params = __commonJS({
  "node_modules/diff/lib/util/params.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.generateOptions = generateOptions;
    function generateOptions(options, defaults) {
      if (typeof options === "function") {
        defaults.callback = options;
      } else if (options) {
        for (var name in options) {
          if (options.hasOwnProperty(name)) {
            defaults[name] = options[name];
          }
        }
      }
      return defaults;
    }
  }
});

// node_modules/diff/lib/diff/line.js
var require_line = __commonJS({
  "node_modules/diff/lib/diff/line.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.diffLines = diffLines;
    exports2.diffTrimmedLines = diffTrimmedLines;
    exports2.lineDiff = void 0;
    var _base = _interopRequireDefault(require_base());
    var _params = require_params();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var lineDiff = (
      /*istanbul ignore start*/
      exports2.lineDiff = /*istanbul ignore end*/
      new /*istanbul ignore start*/
      _base[
        /*istanbul ignore start*/
        "default"
        /*istanbul ignore end*/
      ]()
    );
    lineDiff.tokenize = function(value, options) {
      if (options.stripTrailingCr) {
        value = value.replace(/\r\n/g, "\n");
      }
      var retLines = [], linesAndNewlines = value.split(/(\n|\r\n)/);
      if (!linesAndNewlines[linesAndNewlines.length - 1]) {
        linesAndNewlines.pop();
      }
      for (var i = 0; i < linesAndNewlines.length; i++) {
        var line = linesAndNewlines[i];
        if (i % 2 && !options.newlineIsToken) {
          retLines[retLines.length - 1] += line;
        } else {
          retLines.push(line);
        }
      }
      return retLines;
    };
    lineDiff.equals = function(left, right, options) {
      if (options.ignoreWhitespace) {
        if (!options.newlineIsToken || !left.includes("\n")) {
          left = left.trim();
        }
        if (!options.newlineIsToken || !right.includes("\n")) {
          right = right.trim();
        }
      } else if (options.ignoreNewlineAtEof && !options.newlineIsToken) {
        if (left.endsWith("\n")) {
          left = left.slice(0, -1);
        }
        if (right.endsWith("\n")) {
          right = right.slice(0, -1);
        }
      }
      return (
        /*istanbul ignore start*/
        _base[
          /*istanbul ignore start*/
          "default"
          /*istanbul ignore end*/
        ].prototype.equals.call(this, left, right, options)
      );
    };
    function diffLines(oldStr, newStr, callback) {
      return lineDiff.diff(oldStr, newStr, callback);
    }
    function diffTrimmedLines(oldStr, newStr, callback) {
      var options = (
        /*istanbul ignore start*/
        (0, /*istanbul ignore end*/
        /*istanbul ignore start*/
        _params.generateOptions)(callback, {
          ignoreWhitespace: true
        })
      );
      return lineDiff.diff(oldStr, newStr, options);
    }
  }
});

// node_modules/diff/lib/diff/sentence.js
var require_sentence = __commonJS({
  "node_modules/diff/lib/diff/sentence.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.diffSentences = diffSentences;
    exports2.sentenceDiff = void 0;
    var _base = _interopRequireDefault(require_base());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var sentenceDiff = (
      /*istanbul ignore start*/
      exports2.sentenceDiff = /*istanbul ignore end*/
      new /*istanbul ignore start*/
      _base[
        /*istanbul ignore start*/
        "default"
        /*istanbul ignore end*/
      ]()
    );
    sentenceDiff.tokenize = function(value) {
      return value.split(/(\S.+?[.!?])(?=\s+|$)/);
    };
    function diffSentences(oldStr, newStr, callback) {
      return sentenceDiff.diff(oldStr, newStr, callback);
    }
  }
});

// node_modules/diff/lib/diff/css.js
var require_css = __commonJS({
  "node_modules/diff/lib/diff/css.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.cssDiff = void 0;
    exports2.diffCss = diffCss;
    var _base = _interopRequireDefault(require_base());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var cssDiff = (
      /*istanbul ignore start*/
      exports2.cssDiff = /*istanbul ignore end*/
      new /*istanbul ignore start*/
      _base[
        /*istanbul ignore start*/
        "default"
        /*istanbul ignore end*/
      ]()
    );
    cssDiff.tokenize = function(value) {
      return value.split(/([{}:;,]|\s+)/);
    };
    function diffCss(oldStr, newStr, callback) {
      return cssDiff.diff(oldStr, newStr, callback);
    }
  }
});

// node_modules/diff/lib/diff/json.js
var require_json = __commonJS({
  "node_modules/diff/lib/diff/json.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.canonicalize = canonicalize;
    exports2.diffJson = diffJson;
    exports2.jsonDiff = void 0;
    var _base = _interopRequireDefault(require_base());
    var _line = require_line();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    var jsonDiff = (
      /*istanbul ignore start*/
      exports2.jsonDiff = /*istanbul ignore end*/
      new /*istanbul ignore start*/
      _base[
        /*istanbul ignore start*/
        "default"
        /*istanbul ignore end*/
      ]()
    );
    jsonDiff.useLongestToken = true;
    jsonDiff.tokenize = /*istanbul ignore start*/
    _line.lineDiff.tokenize;
    jsonDiff.castInput = function(value, options) {
      var undefinedReplacement = options.undefinedReplacement, _options$stringifyRep = (
        /*istanbul ignore end*/
        options.stringifyReplacer
      ), stringifyReplacer = _options$stringifyRep === void 0 ? function(k, v) {
        return (
          /*istanbul ignore end*/
          typeof v === "undefined" ? undefinedReplacement : v
        );
      } : _options$stringifyRep;
      return typeof value === "string" ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, "  ");
    };
    jsonDiff.equals = function(left, right, options) {
      return (
        /*istanbul ignore start*/
        _base[
          /*istanbul ignore start*/
          "default"
          /*istanbul ignore end*/
        ].prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, "$1"), right.replace(/,([\r\n])/g, "$1"), options)
      );
    };
    function diffJson(oldObj, newObj, options) {
      return jsonDiff.diff(oldObj, newObj, options);
    }
    function canonicalize(obj, stack, replacementStack, replacer, key) {
      stack = stack || [];
      replacementStack = replacementStack || [];
      if (replacer) {
        obj = replacer(key, obj);
      }
      var i;
      for (i = 0; i < stack.length; i += 1) {
        if (stack[i] === obj) {
          return replacementStack[i];
        }
      }
      var canonicalizedObj;
      if ("[object Array]" === Object.prototype.toString.call(obj)) {
        stack.push(obj);
        canonicalizedObj = new Array(obj.length);
        replacementStack.push(canonicalizedObj);
        for (i = 0; i < obj.length; i += 1) {
          canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, key);
        }
        stack.pop();
        replacementStack.pop();
        return canonicalizedObj;
      }
      if (obj && obj.toJSON) {
        obj = obj.toJSON();
      }
      if (
        /*istanbul ignore start*/
        _typeof(
          /*istanbul ignore end*/
          obj
        ) === "object" && obj !== null
      ) {
        stack.push(obj);
        canonicalizedObj = {};
        replacementStack.push(canonicalizedObj);
        var sortedKeys = [], _key;
        for (_key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, _key)) {
            sortedKeys.push(_key);
          }
        }
        sortedKeys.sort();
        for (i = 0; i < sortedKeys.length; i += 1) {
          _key = sortedKeys[i];
          canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key);
        }
        stack.pop();
        replacementStack.pop();
      } else {
        canonicalizedObj = obj;
      }
      return canonicalizedObj;
    }
  }
});

// node_modules/diff/lib/diff/array.js
var require_array = __commonJS({
  "node_modules/diff/lib/diff/array.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.arrayDiff = void 0;
    exports2.diffArrays = diffArrays;
    var _base = _interopRequireDefault(require_base());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var arrayDiff = (
      /*istanbul ignore start*/
      exports2.arrayDiff = /*istanbul ignore end*/
      new /*istanbul ignore start*/
      _base[
        /*istanbul ignore start*/
        "default"
        /*istanbul ignore end*/
      ]()
    );
    arrayDiff.tokenize = function(value) {
      return value.slice();
    };
    arrayDiff.join = arrayDiff.removeEmpty = function(value) {
      return value;
    };
    function diffArrays(oldArr, newArr, callback) {
      return arrayDiff.diff(oldArr, newArr, callback);
    }
  }
});

// node_modules/diff/lib/patch/line-endings.js
var require_line_endings = __commonJS({
  "node_modules/diff/lib/patch/line-endings.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.isUnix = isUnix;
    exports2.isWin = isWin;
    exports2.unixToWin = unixToWin;
    exports2.winToUnix = winToUnix;
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r2) {
          return Object.getOwnPropertyDescriptor(e, r2).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
          _defineProperty(e, r2, t[r2]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
          Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
        });
      }
      return e;
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == _typeof(i) ? i : i + "";
    }
    function _toPrimitive(t, r) {
      if ("object" != _typeof(t) || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != _typeof(i)) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    function unixToWin(patch) {
      if (Array.isArray(patch)) {
        return patch.map(unixToWin);
      }
      return (
        /*istanbul ignore start*/
        _objectSpread(_objectSpread(
          {},
          /*istanbul ignore end*/
          patch
        ), {}, {
          hunks: patch.hunks.map(function(hunk) {
            return _objectSpread(_objectSpread(
              {},
              /*istanbul ignore end*/
              hunk
            ), {}, {
              lines: hunk.lines.map(function(line, i) {
                var _hunk$lines;
                return (
                  /*istanbul ignore end*/
                  line.startsWith("\\") || line.endsWith("\r") || /*istanbul ignore start*/
                  (_hunk$lines = /*istanbul ignore end*/
                  hunk.lines[i + 1]) !== null && _hunk$lines !== void 0 && /*istanbul ignore start*/
                  _hunk$lines.startsWith("\\") ? line : line + "\r"
                );
              })
            });
          })
        })
      );
    }
    function winToUnix(patch) {
      if (Array.isArray(patch)) {
        return patch.map(winToUnix);
      }
      return (
        /*istanbul ignore start*/
        _objectSpread(_objectSpread(
          {},
          /*istanbul ignore end*/
          patch
        ), {}, {
          hunks: patch.hunks.map(function(hunk) {
            return _objectSpread(_objectSpread(
              {},
              /*istanbul ignore end*/
              hunk
            ), {}, {
              lines: hunk.lines.map(function(line) {
                return (
                  /*istanbul ignore end*/
                  line.endsWith("\r") ? line.substring(0, line.length - 1) : line
                );
              })
            });
          })
        })
      );
    }
    function isUnix(patch) {
      if (!Array.isArray(patch)) {
        patch = [patch];
      }
      return !patch.some(function(index) {
        return (
          /*istanbul ignore end*/
          index.hunks.some(function(hunk) {
            return (
              /*istanbul ignore end*/
              hunk.lines.some(function(line) {
                return (
                  /*istanbul ignore end*/
                  !line.startsWith("\\") && line.endsWith("\r")
                );
              })
            );
          })
        );
      });
    }
    function isWin(patch) {
      if (!Array.isArray(patch)) {
        patch = [patch];
      }
      return patch.some(function(index) {
        return (
          /*istanbul ignore end*/
          index.hunks.some(function(hunk) {
            return (
              /*istanbul ignore end*/
              hunk.lines.some(function(line) {
                return (
                  /*istanbul ignore end*/
                  line.endsWith("\r")
                );
              })
            );
          })
        );
      }) && patch.every(function(index) {
        return (
          /*istanbul ignore end*/
          index.hunks.every(function(hunk) {
            return (
              /*istanbul ignore end*/
              hunk.lines.every(function(line, i) {
                var _hunk$lines2;
                return (
                  /*istanbul ignore end*/
                  line.startsWith("\\") || line.endsWith("\r") || /*istanbul ignore start*/
                  ((_hunk$lines2 = /*istanbul ignore end*/
                  hunk.lines[i + 1]) === null || _hunk$lines2 === void 0 ? void 0 : (
                    /*istanbul ignore start*/
                    _hunk$lines2.startsWith("\\")
                  ))
                );
              })
            );
          })
        );
      });
    }
  }
});

// node_modules/diff/lib/patch/parse.js
var require_parse = __commonJS({
  "node_modules/diff/lib/patch/parse.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.parsePatch = parsePatch;
    function parsePatch(uniDiff) {
      var diffstr = uniDiff.split(/\n/), list = [], i = 0;
      function parseIndex() {
        var index = {};
        list.push(index);
        while (i < diffstr.length) {
          var line = diffstr[i];
          if (/^(\-\-\-|\+\+\+|@@)\s/.test(line)) {
            break;
          }
          var header = /^(?:Index:|diff(?: -r \w+)+)\s+(.+?)\s*$/.exec(line);
          if (header) {
            index.index = header[1];
          }
          i++;
        }
        parseFileHeader(index);
        parseFileHeader(index);
        index.hunks = [];
        while (i < diffstr.length) {
          var _line = diffstr[i];
          if (/^(Index:\s|diff\s|\-\-\-\s|\+\+\+\s|===================================================================)/.test(_line)) {
            break;
          } else if (/^@@/.test(_line)) {
            index.hunks.push(parseHunk());
          } else if (_line) {
            throw new Error("Unknown line " + (i + 1) + " " + JSON.stringify(_line));
          } else {
            i++;
          }
        }
      }
      function parseFileHeader(index) {
        var fileHeader = /^(---|\+\+\+)\s+(.*)\r?$/.exec(diffstr[i]);
        if (fileHeader) {
          var keyPrefix = fileHeader[1] === "---" ? "old" : "new";
          var data = fileHeader[2].split("	", 2);
          var fileName = data[0].replace(/\\\\/g, "\\");
          if (/^".*"$/.test(fileName)) {
            fileName = fileName.substr(1, fileName.length - 2);
          }
          index[keyPrefix + "FileName"] = fileName;
          index[keyPrefix + "Header"] = (data[1] || "").trim();
          i++;
        }
      }
      function parseHunk() {
        var chunkHeaderIndex = i, chunkHeaderLine = diffstr[i++], chunkHeader = chunkHeaderLine.split(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
        var hunk = {
          oldStart: +chunkHeader[1],
          oldLines: typeof chunkHeader[2] === "undefined" ? 1 : +chunkHeader[2],
          newStart: +chunkHeader[3],
          newLines: typeof chunkHeader[4] === "undefined" ? 1 : +chunkHeader[4],
          lines: []
        };
        if (hunk.oldLines === 0) {
          hunk.oldStart += 1;
        }
        if (hunk.newLines === 0) {
          hunk.newStart += 1;
        }
        var addCount = 0, removeCount = 0;
        for (; i < diffstr.length && (removeCount < hunk.oldLines || addCount < hunk.newLines || /*istanbul ignore start*/
        (_diffstr$i = /*istanbul ignore end*/
        diffstr[i]) !== null && _diffstr$i !== void 0 && /*istanbul ignore start*/
        _diffstr$i.startsWith("\\")); i++) {
          var _diffstr$i;
          var operation = diffstr[i].length == 0 && i != diffstr.length - 1 ? " " : diffstr[i][0];
          if (operation === "+" || operation === "-" || operation === " " || operation === "\\") {
            hunk.lines.push(diffstr[i]);
            if (operation === "+") {
              addCount++;
            } else if (operation === "-") {
              removeCount++;
            } else if (operation === " ") {
              addCount++;
              removeCount++;
            }
          } else {
            throw new Error(
              /*istanbul ignore start*/
              "Hunk at line ".concat(
                /*istanbul ignore end*/
                chunkHeaderIndex + 1,
                " contained invalid line "
              ).concat(diffstr[i])
            );
          }
        }
        if (!addCount && hunk.newLines === 1) {
          hunk.newLines = 0;
        }
        if (!removeCount && hunk.oldLines === 1) {
          hunk.oldLines = 0;
        }
        if (addCount !== hunk.newLines) {
          throw new Error("Added line count did not match for hunk at line " + (chunkHeaderIndex + 1));
        }
        if (removeCount !== hunk.oldLines) {
          throw new Error("Removed line count did not match for hunk at line " + (chunkHeaderIndex + 1));
        }
        return hunk;
      }
      while (i < diffstr.length) {
        parseIndex();
      }
      return list;
    }
  }
});

// node_modules/diff/lib/util/distance-iterator.js
var require_distance_iterator = __commonJS({
  "node_modules/diff/lib/util/distance-iterator.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    function _default(start, minLine, maxLine) {
      var wantForward = true, backwardExhausted = false, forwardExhausted = false, localOffset = 1;
      return function iterator() {
        if (wantForward && !forwardExhausted) {
          if (backwardExhausted) {
            localOffset++;
          } else {
            wantForward = false;
          }
          if (start + localOffset <= maxLine) {
            return start + localOffset;
          }
          forwardExhausted = true;
        }
        if (!backwardExhausted) {
          if (!forwardExhausted) {
            wantForward = true;
          }
          if (minLine <= start - localOffset) {
            return start - localOffset++;
          }
          backwardExhausted = true;
          return iterator();
        }
      };
    }
  }
});

// node_modules/diff/lib/patch/apply.js
var require_apply = __commonJS({
  "node_modules/diff/lib/patch/apply.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.applyPatch = applyPatch;
    exports2.applyPatches = applyPatches;
    var _string = require_string();
    var _lineEndings = require_line_endings();
    var _parse = require_parse();
    var _distanceIterator = _interopRequireDefault(require_distance_iterator());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    function applyPatch(source, uniDiff) {
      var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (typeof uniDiff === "string") {
        uniDiff = /*istanbul ignore start*/
        (0, /*istanbul ignore end*/
        /*istanbul ignore start*/
        _parse.parsePatch)(uniDiff);
      }
      if (Array.isArray(uniDiff)) {
        if (uniDiff.length > 1) {
          throw new Error("applyPatch only works with a single input.");
        }
        uniDiff = uniDiff[0];
      }
      if (options.autoConvertLineEndings || options.autoConvertLineEndings == null) {
        if (
          /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _string.hasOnlyWinLineEndings)(source) && /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _lineEndings.isUnix)(uniDiff)
        ) {
          uniDiff = /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _lineEndings.unixToWin)(uniDiff);
        } else if (
          /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _string.hasOnlyUnixLineEndings)(source) && /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _lineEndings.isWin)(uniDiff)
        ) {
          uniDiff = /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _lineEndings.winToUnix)(uniDiff);
        }
      }
      var lines = source.split("\n"), hunks = uniDiff.hunks, compareLine = options.compareLine || function(lineNumber, line2, operation, patchContent) {
        return (
          /*istanbul ignore end*/
          line2 === patchContent
        );
      }, fuzzFactor = options.fuzzFactor || 0, minLine = 0;
      if (fuzzFactor < 0 || !Number.isInteger(fuzzFactor)) {
        throw new Error("fuzzFactor must be a non-negative integer");
      }
      if (!hunks.length) {
        return source;
      }
      var prevLine = "", removeEOFNL = false, addEOFNL = false;
      for (var i = 0; i < hunks[hunks.length - 1].lines.length; i++) {
        var line = hunks[hunks.length - 1].lines[i];
        if (line[0] == "\\") {
          if (prevLine[0] == "+") {
            removeEOFNL = true;
          } else if (prevLine[0] == "-") {
            addEOFNL = true;
          }
        }
        prevLine = line;
      }
      if (removeEOFNL) {
        if (addEOFNL) {
          if (!fuzzFactor && lines[lines.length - 1] == "") {
            return false;
          }
        } else if (lines[lines.length - 1] == "") {
          lines.pop();
        } else if (!fuzzFactor) {
          return false;
        }
      } else if (addEOFNL) {
        if (lines[lines.length - 1] != "") {
          lines.push("");
        } else if (!fuzzFactor) {
          return false;
        }
      }
      function applyHunk(hunkLines, toPos2, maxErrors2) {
        var hunkLinesI = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
        var lastContextLineMatched = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : true;
        var patchedLines = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : [];
        var patchedLinesLength = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : 0;
        var nConsecutiveOldContextLines = 0;
        var nextContextLineMustMatch = false;
        for (; hunkLinesI < hunkLines.length; hunkLinesI++) {
          var hunkLine = hunkLines[hunkLinesI], operation = hunkLine.length > 0 ? hunkLine[0] : " ", content = hunkLine.length > 0 ? hunkLine.substr(1) : hunkLine;
          if (operation === "-") {
            if (compareLine(toPos2 + 1, lines[toPos2], operation, content)) {
              toPos2++;
              nConsecutiveOldContextLines = 0;
            } else {
              if (!maxErrors2 || lines[toPos2] == null) {
                return null;
              }
              patchedLines[patchedLinesLength] = lines[toPos2];
              return applyHunk(hunkLines, toPos2 + 1, maxErrors2 - 1, hunkLinesI, false, patchedLines, patchedLinesLength + 1);
            }
          }
          if (operation === "+") {
            if (!lastContextLineMatched) {
              return null;
            }
            patchedLines[patchedLinesLength] = content;
            patchedLinesLength++;
            nConsecutiveOldContextLines = 0;
            nextContextLineMustMatch = true;
          }
          if (operation === " ") {
            nConsecutiveOldContextLines++;
            patchedLines[patchedLinesLength] = lines[toPos2];
            if (compareLine(toPos2 + 1, lines[toPos2], operation, content)) {
              patchedLinesLength++;
              lastContextLineMatched = true;
              nextContextLineMustMatch = false;
              toPos2++;
            } else {
              if (nextContextLineMustMatch || !maxErrors2) {
                return null;
              }
              return lines[toPos2] && (applyHunk(hunkLines, toPos2 + 1, maxErrors2 - 1, hunkLinesI + 1, false, patchedLines, patchedLinesLength + 1) || applyHunk(hunkLines, toPos2 + 1, maxErrors2 - 1, hunkLinesI, false, patchedLines, patchedLinesLength + 1)) || applyHunk(hunkLines, toPos2, maxErrors2 - 1, hunkLinesI + 1, false, patchedLines, patchedLinesLength);
            }
          }
        }
        patchedLinesLength -= nConsecutiveOldContextLines;
        toPos2 -= nConsecutiveOldContextLines;
        patchedLines.length = patchedLinesLength;
        return {
          patchedLines,
          oldLineLastI: toPos2 - 1
        };
      }
      var resultLines = [];
      var prevHunkOffset = 0;
      for (var _i = 0; _i < hunks.length; _i++) {
        var hunk = hunks[_i];
        var hunkResult = (
          /*istanbul ignore start*/
          void 0
        );
        var maxLine = lines.length - hunk.oldLines + fuzzFactor;
        var toPos = (
          /*istanbul ignore start*/
          void 0
        );
        for (var maxErrors = 0; maxErrors <= fuzzFactor; maxErrors++) {
          toPos = hunk.oldStart + prevHunkOffset - 1;
          var iterator = (
            /*istanbul ignore start*/
            (0, /*istanbul ignore end*/
            /*istanbul ignore start*/
            _distanceIterator[
              /*istanbul ignore start*/
              "default"
              /*istanbul ignore end*/
            ])(toPos, minLine, maxLine)
          );
          for (; toPos !== void 0; toPos = iterator()) {
            hunkResult = applyHunk(hunk.lines, toPos, maxErrors);
            if (hunkResult) {
              break;
            }
          }
          if (hunkResult) {
            break;
          }
        }
        if (!hunkResult) {
          return false;
        }
        for (var _i2 = minLine; _i2 < toPos; _i2++) {
          resultLines.push(lines[_i2]);
        }
        for (var _i3 = 0; _i3 < hunkResult.patchedLines.length; _i3++) {
          var _line = hunkResult.patchedLines[_i3];
          resultLines.push(_line);
        }
        minLine = hunkResult.oldLineLastI + 1;
        prevHunkOffset = toPos + 1 - hunk.oldStart;
      }
      for (var _i4 = minLine; _i4 < lines.length; _i4++) {
        resultLines.push(lines[_i4]);
      }
      return resultLines.join("\n");
    }
    function applyPatches(uniDiff, options) {
      if (typeof uniDiff === "string") {
        uniDiff = /*istanbul ignore start*/
        (0, /*istanbul ignore end*/
        /*istanbul ignore start*/
        _parse.parsePatch)(uniDiff);
      }
      var currentIndex = 0;
      function processIndex() {
        var index = uniDiff[currentIndex++];
        if (!index) {
          return options.complete();
        }
        options.loadFile(index, function(err, data) {
          if (err) {
            return options.complete(err);
          }
          var updatedContent = applyPatch(data, index, options);
          options.patched(index, updatedContent, function(err2) {
            if (err2) {
              return options.complete(err2);
            }
            processIndex();
          });
        });
      }
      processIndex();
    }
  }
});

// node_modules/diff/lib/patch/create.js
var require_create = __commonJS({
  "node_modules/diff/lib/patch/create.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.createPatch = createPatch;
    exports2.createTwoFilesPatch = createTwoFilesPatch;
    exports2.formatPatch = formatPatch;
    exports2.structuredPatch = structuredPatch;
    var _line = require_line();
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
    }
    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _iterableToArray(iter) {
      if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
    }
    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
      return arr2;
    }
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r2) {
          return Object.getOwnPropertyDescriptor(e, r2).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
          _defineProperty(e, r2, t[r2]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
          Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
        });
      }
      return e;
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == _typeof(i) ? i : i + "";
    }
    function _toPrimitive(t, r) {
      if ("object" != _typeof(t) || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != _typeof(i)) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    function structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
      if (!options) {
        options = {};
      }
      if (typeof options === "function") {
        options = {
          callback: options
        };
      }
      if (typeof options.context === "undefined") {
        options.context = 4;
      }
      if (options.newlineIsToken) {
        throw new Error("newlineIsToken may not be used with patch-generation functions, only with diffing functions");
      }
      if (!options.callback) {
        return diffLinesResultToPatch(
          /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _line.diffLines)(oldStr, newStr, options)
        );
      } else {
        var _options = (
          /*istanbul ignore end*/
          options
        ), _callback = _options.callback;
        (0, /*istanbul ignore end*/
        /*istanbul ignore start*/
        _line.diffLines)(
          oldStr,
          newStr,
          /*istanbul ignore start*/
          _objectSpread(_objectSpread(
            {},
            /*istanbul ignore end*/
            options
          ), {}, {
            callback: function callback(diff) {
              var patch = diffLinesResultToPatch(diff);
              _callback(patch);
            }
          })
        );
      }
      function diffLinesResultToPatch(diff) {
        if (!diff) {
          return;
        }
        diff.push({
          value: "",
          lines: []
        });
        function contextLines(lines) {
          return lines.map(function(entry) {
            return " " + entry;
          });
        }
        var hunks = [];
        var oldRangeStart = 0, newRangeStart = 0, curRange = [], oldLine = 1, newLine = 1;
        var _loop = function _loop2() {
          var current = diff[i], lines = current.lines || splitLines(current.value);
          current.lines = lines;
          if (current.added || current.removed) {
            var _curRange;
            if (!oldRangeStart) {
              var prev = diff[i - 1];
              oldRangeStart = oldLine;
              newRangeStart = newLine;
              if (prev) {
                curRange = options.context > 0 ? contextLines(prev.lines.slice(-options.context)) : [];
                oldRangeStart -= curRange.length;
                newRangeStart -= curRange.length;
              }
            }
            (_curRange = /*istanbul ignore end*/
            curRange).push.apply(
              /*istanbul ignore start*/
              _curRange,
              /*istanbul ignore start*/
              _toConsumableArray(
                /*istanbul ignore end*/
                lines.map(function(entry) {
                  return (current.added ? "+" : "-") + entry;
                })
              )
            );
            if (current.added) {
              newLine += lines.length;
            } else {
              oldLine += lines.length;
            }
          } else {
            if (oldRangeStart) {
              if (lines.length <= options.context * 2 && i < diff.length - 2) {
                var _curRange2;
                (_curRange2 = /*istanbul ignore end*/
                curRange).push.apply(
                  /*istanbul ignore start*/
                  _curRange2,
                  /*istanbul ignore start*/
                  _toConsumableArray(
                    /*istanbul ignore end*/
                    contextLines(lines)
                  )
                );
              } else {
                var _curRange3;
                var contextSize = Math.min(lines.length, options.context);
                (_curRange3 = /*istanbul ignore end*/
                curRange).push.apply(
                  /*istanbul ignore start*/
                  _curRange3,
                  /*istanbul ignore start*/
                  _toConsumableArray(
                    /*istanbul ignore end*/
                    contextLines(lines.slice(0, contextSize))
                  )
                );
                var _hunk = {
                  oldStart: oldRangeStart,
                  oldLines: oldLine - oldRangeStart + contextSize,
                  newStart: newRangeStart,
                  newLines: newLine - newRangeStart + contextSize,
                  lines: curRange
                };
                hunks.push(_hunk);
                oldRangeStart = 0;
                newRangeStart = 0;
                curRange = [];
              }
            }
            oldLine += lines.length;
            newLine += lines.length;
          }
        };
        for (var i = 0; i < diff.length; i++) {
          _loop();
        }
        for (
          var _i = 0, _hunks = (
            /*istanbul ignore end*/
            hunks
          );
          /*istanbul ignore start*/
          _i < _hunks.length;
          /*istanbul ignore start*/
          _i++
        ) {
          var hunk = (
            /*istanbul ignore start*/
            _hunks[_i]
          );
          for (var _i2 = 0; _i2 < hunk.lines.length; _i2++) {
            if (hunk.lines[_i2].endsWith("\n")) {
              hunk.lines[_i2] = hunk.lines[_i2].slice(0, -1);
            } else {
              hunk.lines.splice(_i2 + 1, 0, "\\ No newline at end of file");
              _i2++;
            }
          }
        }
        return {
          oldFileName,
          newFileName,
          oldHeader,
          newHeader,
          hunks
        };
      }
    }
    function formatPatch(diff) {
      if (Array.isArray(diff)) {
        return diff.map(formatPatch).join("\n");
      }
      var ret = [];
      if (diff.oldFileName == diff.newFileName) {
        ret.push("Index: " + diff.oldFileName);
      }
      ret.push("===================================================================");
      ret.push("--- " + diff.oldFileName + (typeof diff.oldHeader === "undefined" ? "" : "	" + diff.oldHeader));
      ret.push("+++ " + diff.newFileName + (typeof diff.newHeader === "undefined" ? "" : "	" + diff.newHeader));
      for (var i = 0; i < diff.hunks.length; i++) {
        var hunk = diff.hunks[i];
        if (hunk.oldLines === 0) {
          hunk.oldStart -= 1;
        }
        if (hunk.newLines === 0) {
          hunk.newStart -= 1;
        }
        ret.push("@@ -" + hunk.oldStart + "," + hunk.oldLines + " +" + hunk.newStart + "," + hunk.newLines + " @@");
        ret.push.apply(ret, hunk.lines);
      }
      return ret.join("\n") + "\n";
    }
    function createTwoFilesPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
      var _options2;
      if (typeof options === "function") {
        options = {
          callback: options
        };
      }
      if (!/*istanbul ignore start*/
      ((_options2 = /*istanbul ignore end*/
      options) !== null && _options2 !== void 0 && /*istanbul ignore start*/
      _options2.callback)) {
        var patchObj = structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options);
        if (!patchObj) {
          return;
        }
        return formatPatch(patchObj);
      } else {
        var _options3 = (
          /*istanbul ignore end*/
          options
        ), _callback2 = _options3.callback;
        structuredPatch(
          oldFileName,
          newFileName,
          oldStr,
          newStr,
          oldHeader,
          newHeader,
          /*istanbul ignore start*/
          _objectSpread(_objectSpread(
            {},
            /*istanbul ignore end*/
            options
          ), {}, {
            callback: function callback(patchObj2) {
              if (!patchObj2) {
                _callback2();
              } else {
                _callback2(formatPatch(patchObj2));
              }
            }
          })
        );
      }
    }
    function createPatch(fileName, oldStr, newStr, oldHeader, newHeader, options) {
      return createTwoFilesPatch(fileName, fileName, oldStr, newStr, oldHeader, newHeader, options);
    }
    function splitLines(text) {
      var hasTrailingNl = text.endsWith("\n");
      var result = text.split("\n").map(function(line) {
        return (
          /*istanbul ignore end*/
          line + "\n"
        );
      });
      if (hasTrailingNl) {
        result.pop();
      } else {
        result.push(result.pop().slice(0, -1));
      }
      return result;
    }
  }
});

// node_modules/diff/lib/util/array.js
var require_array2 = __commonJS({
  "node_modules/diff/lib/util/array.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.arrayEqual = arrayEqual;
    exports2.arrayStartsWith = arrayStartsWith;
    function arrayEqual(a, b) {
      if (a.length !== b.length) {
        return false;
      }
      return arrayStartsWith(a, b);
    }
    function arrayStartsWith(array, start) {
      if (start.length > array.length) {
        return false;
      }
      for (var i = 0; i < start.length; i++) {
        if (start[i] !== array[i]) {
          return false;
        }
      }
      return true;
    }
  }
});

// node_modules/diff/lib/patch/merge.js
var require_merge = __commonJS({
  "node_modules/diff/lib/patch/merge.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.calcLineCount = calcLineCount;
    exports2.merge = merge;
    var _create = require_create();
    var _parse = require_parse();
    var _array = require_array2();
    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
    }
    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _iterableToArray(iter) {
      if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
    }
    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
      return arr2;
    }
    function calcLineCount(hunk) {
      var _calcOldNewLineCount = (
        /*istanbul ignore end*/
        calcOldNewLineCount(hunk.lines)
      ), oldLines = _calcOldNewLineCount.oldLines, newLines = _calcOldNewLineCount.newLines;
      if (oldLines !== void 0) {
        hunk.oldLines = oldLines;
      } else {
        delete hunk.oldLines;
      }
      if (newLines !== void 0) {
        hunk.newLines = newLines;
      } else {
        delete hunk.newLines;
      }
    }
    function merge(mine, theirs, base) {
      mine = loadPatch(mine, base);
      theirs = loadPatch(theirs, base);
      var ret = {};
      if (mine.index || theirs.index) {
        ret.index = mine.index || theirs.index;
      }
      if (mine.newFileName || theirs.newFileName) {
        if (!fileNameChanged(mine)) {
          ret.oldFileName = theirs.oldFileName || mine.oldFileName;
          ret.newFileName = theirs.newFileName || mine.newFileName;
          ret.oldHeader = theirs.oldHeader || mine.oldHeader;
          ret.newHeader = theirs.newHeader || mine.newHeader;
        } else if (!fileNameChanged(theirs)) {
          ret.oldFileName = mine.oldFileName;
          ret.newFileName = mine.newFileName;
          ret.oldHeader = mine.oldHeader;
          ret.newHeader = mine.newHeader;
        } else {
          ret.oldFileName = selectField(ret, mine.oldFileName, theirs.oldFileName);
          ret.newFileName = selectField(ret, mine.newFileName, theirs.newFileName);
          ret.oldHeader = selectField(ret, mine.oldHeader, theirs.oldHeader);
          ret.newHeader = selectField(ret, mine.newHeader, theirs.newHeader);
        }
      }
      ret.hunks = [];
      var mineIndex = 0, theirsIndex = 0, mineOffset = 0, theirsOffset = 0;
      while (mineIndex < mine.hunks.length || theirsIndex < theirs.hunks.length) {
        var mineCurrent = mine.hunks[mineIndex] || {
          oldStart: Infinity
        }, theirsCurrent = theirs.hunks[theirsIndex] || {
          oldStart: Infinity
        };
        if (hunkBefore(mineCurrent, theirsCurrent)) {
          ret.hunks.push(cloneHunk(mineCurrent, mineOffset));
          mineIndex++;
          theirsOffset += mineCurrent.newLines - mineCurrent.oldLines;
        } else if (hunkBefore(theirsCurrent, mineCurrent)) {
          ret.hunks.push(cloneHunk(theirsCurrent, theirsOffset));
          theirsIndex++;
          mineOffset += theirsCurrent.newLines - theirsCurrent.oldLines;
        } else {
          var mergedHunk = {
            oldStart: Math.min(mineCurrent.oldStart, theirsCurrent.oldStart),
            oldLines: 0,
            newStart: Math.min(mineCurrent.newStart + mineOffset, theirsCurrent.oldStart + theirsOffset),
            newLines: 0,
            lines: []
          };
          mergeLines(mergedHunk, mineCurrent.oldStart, mineCurrent.lines, theirsCurrent.oldStart, theirsCurrent.lines);
          theirsIndex++;
          mineIndex++;
          ret.hunks.push(mergedHunk);
        }
      }
      return ret;
    }
    function loadPatch(param, base) {
      if (typeof param === "string") {
        if (/^@@/m.test(param) || /^Index:/m.test(param)) {
          return (
            /*istanbul ignore start*/
            (0, /*istanbul ignore end*/
            /*istanbul ignore start*/
            _parse.parsePatch)(param)[0]
          );
        }
        if (!base) {
          throw new Error("Must provide a base reference or pass in a patch");
        }
        return (
          /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _create.structuredPatch)(void 0, void 0, base, param)
        );
      }
      return param;
    }
    function fileNameChanged(patch) {
      return patch.newFileName && patch.newFileName !== patch.oldFileName;
    }
    function selectField(index, mine, theirs) {
      if (mine === theirs) {
        return mine;
      } else {
        index.conflict = true;
        return {
          mine,
          theirs
        };
      }
    }
    function hunkBefore(test, check) {
      return test.oldStart < check.oldStart && test.oldStart + test.oldLines < check.oldStart;
    }
    function cloneHunk(hunk, offset) {
      return {
        oldStart: hunk.oldStart,
        oldLines: hunk.oldLines,
        newStart: hunk.newStart + offset,
        newLines: hunk.newLines,
        lines: hunk.lines
      };
    }
    function mergeLines(hunk, mineOffset, mineLines, theirOffset, theirLines) {
      var mine = {
        offset: mineOffset,
        lines: mineLines,
        index: 0
      }, their = {
        offset: theirOffset,
        lines: theirLines,
        index: 0
      };
      insertLeading(hunk, mine, their);
      insertLeading(hunk, their, mine);
      while (mine.index < mine.lines.length && their.index < their.lines.length) {
        var mineCurrent = mine.lines[mine.index], theirCurrent = their.lines[their.index];
        if ((mineCurrent[0] === "-" || mineCurrent[0] === "+") && (theirCurrent[0] === "-" || theirCurrent[0] === "+")) {
          mutualChange(hunk, mine, their);
        } else if (mineCurrent[0] === "+" && theirCurrent[0] === " ") {
          var _hunk$lines;
          (_hunk$lines = /*istanbul ignore end*/
          hunk.lines).push.apply(
            /*istanbul ignore start*/
            _hunk$lines,
            /*istanbul ignore start*/
            _toConsumableArray(
              /*istanbul ignore end*/
              collectChange(mine)
            )
          );
        } else if (theirCurrent[0] === "+" && mineCurrent[0] === " ") {
          var _hunk$lines2;
          (_hunk$lines2 = /*istanbul ignore end*/
          hunk.lines).push.apply(
            /*istanbul ignore start*/
            _hunk$lines2,
            /*istanbul ignore start*/
            _toConsumableArray(
              /*istanbul ignore end*/
              collectChange(their)
            )
          );
        } else if (mineCurrent[0] === "-" && theirCurrent[0] === " ") {
          removal(hunk, mine, their);
        } else if (theirCurrent[0] === "-" && mineCurrent[0] === " ") {
          removal(hunk, their, mine, true);
        } else if (mineCurrent === theirCurrent) {
          hunk.lines.push(mineCurrent);
          mine.index++;
          their.index++;
        } else {
          conflict(hunk, collectChange(mine), collectChange(their));
        }
      }
      insertTrailing(hunk, mine);
      insertTrailing(hunk, their);
      calcLineCount(hunk);
    }
    function mutualChange(hunk, mine, their) {
      var myChanges = collectChange(mine), theirChanges = collectChange(their);
      if (allRemoves(myChanges) && allRemoves(theirChanges)) {
        if (
          /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _array.arrayStartsWith)(myChanges, theirChanges) && skipRemoveSuperset(their, myChanges, myChanges.length - theirChanges.length)
        ) {
          var _hunk$lines3;
          (_hunk$lines3 = /*istanbul ignore end*/
          hunk.lines).push.apply(
            /*istanbul ignore start*/
            _hunk$lines3,
            /*istanbul ignore start*/
            _toConsumableArray(
              /*istanbul ignore end*/
              myChanges
            )
          );
          return;
        } else if (
          /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _array.arrayStartsWith)(theirChanges, myChanges) && skipRemoveSuperset(mine, theirChanges, theirChanges.length - myChanges.length)
        ) {
          var _hunk$lines4;
          (_hunk$lines4 = /*istanbul ignore end*/
          hunk.lines).push.apply(
            /*istanbul ignore start*/
            _hunk$lines4,
            /*istanbul ignore start*/
            _toConsumableArray(
              /*istanbul ignore end*/
              theirChanges
            )
          );
          return;
        }
      } else if (
        /*istanbul ignore start*/
        (0, /*istanbul ignore end*/
        /*istanbul ignore start*/
        _array.arrayEqual)(myChanges, theirChanges)
      ) {
        var _hunk$lines5;
        (_hunk$lines5 = /*istanbul ignore end*/
        hunk.lines).push.apply(
          /*istanbul ignore start*/
          _hunk$lines5,
          /*istanbul ignore start*/
          _toConsumableArray(
            /*istanbul ignore end*/
            myChanges
          )
        );
        return;
      }
      conflict(hunk, myChanges, theirChanges);
    }
    function removal(hunk, mine, their, swap) {
      var myChanges = collectChange(mine), theirChanges = collectContext(their, myChanges);
      if (theirChanges.merged) {
        var _hunk$lines6;
        (_hunk$lines6 = /*istanbul ignore end*/
        hunk.lines).push.apply(
          /*istanbul ignore start*/
          _hunk$lines6,
          /*istanbul ignore start*/
          _toConsumableArray(
            /*istanbul ignore end*/
            theirChanges.merged
          )
        );
      } else {
        conflict(hunk, swap ? theirChanges : myChanges, swap ? myChanges : theirChanges);
      }
    }
    function conflict(hunk, mine, their) {
      hunk.conflict = true;
      hunk.lines.push({
        conflict: true,
        mine,
        theirs: their
      });
    }
    function insertLeading(hunk, insert, their) {
      while (insert.offset < their.offset && insert.index < insert.lines.length) {
        var line = insert.lines[insert.index++];
        hunk.lines.push(line);
        insert.offset++;
      }
    }
    function insertTrailing(hunk, insert) {
      while (insert.index < insert.lines.length) {
        var line = insert.lines[insert.index++];
        hunk.lines.push(line);
      }
    }
    function collectChange(state) {
      var ret = [], operation = state.lines[state.index][0];
      while (state.index < state.lines.length) {
        var line = state.lines[state.index];
        if (operation === "-" && line[0] === "+") {
          operation = "+";
        }
        if (operation === line[0]) {
          ret.push(line);
          state.index++;
        } else {
          break;
        }
      }
      return ret;
    }
    function collectContext(state, matchChanges) {
      var changes = [], merged = [], matchIndex = 0, contextChanges = false, conflicted = false;
      while (matchIndex < matchChanges.length && state.index < state.lines.length) {
        var change = state.lines[state.index], match = matchChanges[matchIndex];
        if (match[0] === "+") {
          break;
        }
        contextChanges = contextChanges || change[0] !== " ";
        merged.push(match);
        matchIndex++;
        if (change[0] === "+") {
          conflicted = true;
          while (change[0] === "+") {
            changes.push(change);
            change = state.lines[++state.index];
          }
        }
        if (match.substr(1) === change.substr(1)) {
          changes.push(change);
          state.index++;
        } else {
          conflicted = true;
        }
      }
      if ((matchChanges[matchIndex] || "")[0] === "+" && contextChanges) {
        conflicted = true;
      }
      if (conflicted) {
        return changes;
      }
      while (matchIndex < matchChanges.length) {
        merged.push(matchChanges[matchIndex++]);
      }
      return {
        merged,
        changes
      };
    }
    function allRemoves(changes) {
      return changes.reduce(function(prev, change) {
        return prev && change[0] === "-";
      }, true);
    }
    function skipRemoveSuperset(state, removeChanges, delta) {
      for (var i = 0; i < delta; i++) {
        var changeContent = removeChanges[removeChanges.length - delta + i].substr(1);
        if (state.lines[state.index + i] !== " " + changeContent) {
          return false;
        }
      }
      state.index += delta;
      return true;
    }
    function calcOldNewLineCount(lines) {
      var oldLines = 0;
      var newLines = 0;
      lines.forEach(function(line) {
        if (typeof line !== "string") {
          var myCount = calcOldNewLineCount(line.mine);
          var theirCount = calcOldNewLineCount(line.theirs);
          if (oldLines !== void 0) {
            if (myCount.oldLines === theirCount.oldLines) {
              oldLines += myCount.oldLines;
            } else {
              oldLines = void 0;
            }
          }
          if (newLines !== void 0) {
            if (myCount.newLines === theirCount.newLines) {
              newLines += myCount.newLines;
            } else {
              newLines = void 0;
            }
          }
        } else {
          if (newLines !== void 0 && (line[0] === "+" || line[0] === " ")) {
            newLines++;
          }
          if (oldLines !== void 0 && (line[0] === "-" || line[0] === " ")) {
            oldLines++;
          }
        }
      });
      return {
        oldLines,
        newLines
      };
    }
  }
});

// node_modules/diff/lib/patch/reverse.js
var require_reverse = __commonJS({
  "node_modules/diff/lib/patch/reverse.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.reversePatch = reversePatch;
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r2) {
          return Object.getOwnPropertyDescriptor(e, r2).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
          _defineProperty(e, r2, t[r2]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
          Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
        });
      }
      return e;
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == _typeof(i) ? i : i + "";
    }
    function _toPrimitive(t, r) {
      if ("object" != _typeof(t) || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != _typeof(i)) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    function reversePatch(structuredPatch) {
      if (Array.isArray(structuredPatch)) {
        return structuredPatch.map(reversePatch).reverse();
      }
      return (
        /*istanbul ignore start*/
        _objectSpread(_objectSpread(
          {},
          /*istanbul ignore end*/
          structuredPatch
        ), {}, {
          oldFileName: structuredPatch.newFileName,
          oldHeader: structuredPatch.newHeader,
          newFileName: structuredPatch.oldFileName,
          newHeader: structuredPatch.oldHeader,
          hunks: structuredPatch.hunks.map(function(hunk) {
            return {
              oldLines: hunk.newLines,
              oldStart: hunk.newStart,
              newLines: hunk.oldLines,
              newStart: hunk.oldStart,
              lines: hunk.lines.map(function(l) {
                if (l.startsWith("-")) {
                  return (
                    /*istanbul ignore start*/
                    "+".concat(
                      /*istanbul ignore end*/
                      l.slice(1)
                    )
                  );
                }
                if (l.startsWith("+")) {
                  return (
                    /*istanbul ignore start*/
                    "-".concat(
                      /*istanbul ignore end*/
                      l.slice(1)
                    )
                  );
                }
                return l;
              })
            };
          })
        })
      );
    }
  }
});

// node_modules/diff/lib/convert/dmp.js
var require_dmp = __commonJS({
  "node_modules/diff/lib/convert/dmp.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.convertChangesToDMP = convertChangesToDMP;
    function convertChangesToDMP(changes) {
      var ret = [], change, operation;
      for (var i = 0; i < changes.length; i++) {
        change = changes[i];
        if (change.added) {
          operation = 1;
        } else if (change.removed) {
          operation = -1;
        } else {
          operation = 0;
        }
        ret.push([operation, change.value]);
      }
      return ret;
    }
  }
});

// node_modules/diff/lib/convert/xml.js
var require_xml = __commonJS({
  "node_modules/diff/lib/convert/xml.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.convertChangesToXML = convertChangesToXML;
    function convertChangesToXML(changes) {
      var ret = [];
      for (var i = 0; i < changes.length; i++) {
        var change = changes[i];
        if (change.added) {
          ret.push("<ins>");
        } else if (change.removed) {
          ret.push("<del>");
        }
        ret.push(escapeHTML(change.value));
        if (change.added) {
          ret.push("</ins>");
        } else if (change.removed) {
          ret.push("</del>");
        }
      }
      return ret.join("");
    }
    function escapeHTML(s) {
      var n = s;
      n = n.replace(/&/g, "&amp;");
      n = n.replace(/</g, "&lt;");
      n = n.replace(/>/g, "&gt;");
      n = n.replace(/"/g, "&quot;");
      return n;
    }
  }
});

// node_modules/diff/lib/index.js
var require_lib = __commonJS({
  "node_modules/diff/lib/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "Diff", {
      enumerable: true,
      get: function get() {
        return _base["default"];
      }
    });
    Object.defineProperty(exports2, "applyPatch", {
      enumerable: true,
      get: function get() {
        return _apply.applyPatch;
      }
    });
    Object.defineProperty(exports2, "applyPatches", {
      enumerable: true,
      get: function get() {
        return _apply.applyPatches;
      }
    });
    Object.defineProperty(exports2, "canonicalize", {
      enumerable: true,
      get: function get() {
        return _json.canonicalize;
      }
    });
    Object.defineProperty(exports2, "convertChangesToDMP", {
      enumerable: true,
      get: function get() {
        return _dmp.convertChangesToDMP;
      }
    });
    Object.defineProperty(exports2, "convertChangesToXML", {
      enumerable: true,
      get: function get() {
        return _xml.convertChangesToXML;
      }
    });
    Object.defineProperty(exports2, "createPatch", {
      enumerable: true,
      get: function get() {
        return _create.createPatch;
      }
    });
    Object.defineProperty(exports2, "createTwoFilesPatch", {
      enumerable: true,
      get: function get() {
        return _create.createTwoFilesPatch;
      }
    });
    Object.defineProperty(exports2, "diffArrays", {
      enumerable: true,
      get: function get() {
        return _array.diffArrays;
      }
    });
    Object.defineProperty(exports2, "diffChars", {
      enumerable: true,
      get: function get() {
        return _character.diffChars;
      }
    });
    Object.defineProperty(exports2, "diffCss", {
      enumerable: true,
      get: function get() {
        return _css.diffCss;
      }
    });
    Object.defineProperty(exports2, "diffJson", {
      enumerable: true,
      get: function get() {
        return _json.diffJson;
      }
    });
    Object.defineProperty(exports2, "diffLines", {
      enumerable: true,
      get: function get() {
        return _line.diffLines;
      }
    });
    Object.defineProperty(exports2, "diffSentences", {
      enumerable: true,
      get: function get() {
        return _sentence.diffSentences;
      }
    });
    Object.defineProperty(exports2, "diffTrimmedLines", {
      enumerable: true,
      get: function get() {
        return _line.diffTrimmedLines;
      }
    });
    Object.defineProperty(exports2, "diffWords", {
      enumerable: true,
      get: function get() {
        return _word.diffWords;
      }
    });
    Object.defineProperty(exports2, "diffWordsWithSpace", {
      enumerable: true,
      get: function get() {
        return _word.diffWordsWithSpace;
      }
    });
    Object.defineProperty(exports2, "formatPatch", {
      enumerable: true,
      get: function get() {
        return _create.formatPatch;
      }
    });
    Object.defineProperty(exports2, "merge", {
      enumerable: true,
      get: function get() {
        return _merge.merge;
      }
    });
    Object.defineProperty(exports2, "parsePatch", {
      enumerable: true,
      get: function get() {
        return _parse.parsePatch;
      }
    });
    Object.defineProperty(exports2, "reversePatch", {
      enumerable: true,
      get: function get() {
        return _reverse.reversePatch;
      }
    });
    Object.defineProperty(exports2, "structuredPatch", {
      enumerable: true,
      get: function get() {
        return _create.structuredPatch;
      }
    });
    var _base = _interopRequireDefault(require_base());
    var _character = require_character();
    var _word = require_word();
    var _line = require_line();
    var _sentence = require_sentence();
    var _css = require_css();
    var _json = require_json();
    var _array = require_array();
    var _apply = require_apply();
    var _parse = require_parse();
    var _merge = require_merge();
    var _reverse = require_reverse();
    var _create = require_create();
    var _dmp = require_dmp();
    var _xml = require_xml();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
  }
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports2, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/he/he.js
var require_he = __commonJS({
  "node_modules/he/he.js"(exports2, module2) {
    (function(root) {
      var freeExports = typeof exports2 == "object" && exports2;
      var freeModule = typeof module2 == "object" && module2 && module2.exports == freeExports && module2;
      var freeGlobal = typeof global == "object" && global;
      if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
        root = freeGlobal;
      }
      var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
      var regexAsciiWhitelist = /[\x01-\x7F]/g;
      var regexBmpWhitelist = /[\x01-\t\x0B\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;
      var regexEncodeNonAscii = /<\u20D2|=\u20E5|>\u20D2|\u205F\u200A|\u219D\u0338|\u2202\u0338|\u2220\u20D2|\u2229\uFE00|\u222A\uFE00|\u223C\u20D2|\u223D\u0331|\u223E\u0333|\u2242\u0338|\u224B\u0338|\u224D\u20D2|\u224E\u0338|\u224F\u0338|\u2250\u0338|\u2261\u20E5|\u2264\u20D2|\u2265\u20D2|\u2266\u0338|\u2267\u0338|\u2268\uFE00|\u2269\uFE00|\u226A\u0338|\u226A\u20D2|\u226B\u0338|\u226B\u20D2|\u227F\u0338|\u2282\u20D2|\u2283\u20D2|\u228A\uFE00|\u228B\uFE00|\u228F\u0338|\u2290\u0338|\u2293\uFE00|\u2294\uFE00|\u22B4\u20D2|\u22B5\u20D2|\u22D8\u0338|\u22D9\u0338|\u22DA\uFE00|\u22DB\uFE00|\u22F5\u0338|\u22F9\u0338|\u2933\u0338|\u29CF\u0338|\u29D0\u0338|\u2A6D\u0338|\u2A70\u0338|\u2A7D\u0338|\u2A7E\u0338|\u2AA1\u0338|\u2AA2\u0338|\u2AAC\uFE00|\u2AAD\uFE00|\u2AAF\u0338|\u2AB0\u0338|\u2AC5\u0338|\u2AC6\u0338|\u2ACB\uFE00|\u2ACC\uFE00|\u2AFD\u20E5|[\xA0-\u0113\u0116-\u0122\u0124-\u012B\u012E-\u014D\u0150-\u017E\u0192\u01B5\u01F5\u0237\u02C6\u02C7\u02D8-\u02DD\u0311\u0391-\u03A1\u03A3-\u03A9\u03B1-\u03C9\u03D1\u03D2\u03D5\u03D6\u03DC\u03DD\u03F0\u03F1\u03F5\u03F6\u0401-\u040C\u040E-\u044F\u0451-\u045C\u045E\u045F\u2002-\u2005\u2007-\u2010\u2013-\u2016\u2018-\u201A\u201C-\u201E\u2020-\u2022\u2025\u2026\u2030-\u2035\u2039\u203A\u203E\u2041\u2043\u2044\u204F\u2057\u205F-\u2063\u20AC\u20DB\u20DC\u2102\u2105\u210A-\u2113\u2115-\u211E\u2122\u2124\u2127-\u2129\u212C\u212D\u212F-\u2131\u2133-\u2138\u2145-\u2148\u2153-\u215E\u2190-\u219B\u219D-\u21A7\u21A9-\u21AE\u21B0-\u21B3\u21B5-\u21B7\u21BA-\u21DB\u21DD\u21E4\u21E5\u21F5\u21FD-\u2205\u2207-\u2209\u220B\u220C\u220F-\u2214\u2216-\u2218\u221A\u221D-\u2238\u223A-\u2257\u2259\u225A\u225C\u225F-\u2262\u2264-\u228B\u228D-\u229B\u229D-\u22A5\u22A7-\u22B0\u22B2-\u22BB\u22BD-\u22DB\u22DE-\u22E3\u22E6-\u22F7\u22F9-\u22FE\u2305\u2306\u2308-\u2310\u2312\u2313\u2315\u2316\u231C-\u231F\u2322\u2323\u232D\u232E\u2336\u233D\u233F\u237C\u23B0\u23B1\u23B4-\u23B6\u23DC-\u23DF\u23E2\u23E7\u2423\u24C8\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2550-\u256C\u2580\u2584\u2588\u2591-\u2593\u25A1\u25AA\u25AB\u25AD\u25AE\u25B1\u25B3-\u25B5\u25B8\u25B9\u25BD-\u25BF\u25C2\u25C3\u25CA\u25CB\u25EC\u25EF\u25F8-\u25FC\u2605\u2606\u260E\u2640\u2642\u2660\u2663\u2665\u2666\u266A\u266D-\u266F\u2713\u2717\u2720\u2736\u2758\u2772\u2773\u27C8\u27C9\u27E6-\u27ED\u27F5-\u27FA\u27FC\u27FF\u2902-\u2905\u290C-\u2913\u2916\u2919-\u2920\u2923-\u292A\u2933\u2935-\u2939\u293C\u293D\u2945\u2948-\u294B\u294E-\u2976\u2978\u2979\u297B-\u297F\u2985\u2986\u298B-\u2996\u299A\u299C\u299D\u29A4-\u29B7\u29B9\u29BB\u29BC\u29BE-\u29C5\u29C9\u29CD-\u29D0\u29DC-\u29DE\u29E3-\u29E5\u29EB\u29F4\u29F6\u2A00-\u2A02\u2A04\u2A06\u2A0C\u2A0D\u2A10-\u2A17\u2A22-\u2A27\u2A29\u2A2A\u2A2D-\u2A31\u2A33-\u2A3C\u2A3F\u2A40\u2A42-\u2A4D\u2A50\u2A53-\u2A58\u2A5A-\u2A5D\u2A5F\u2A66\u2A6A\u2A6D-\u2A75\u2A77-\u2A9A\u2A9D-\u2AA2\u2AA4-\u2AB0\u2AB3-\u2AC8\u2ACB\u2ACC\u2ACF-\u2ADB\u2AE4\u2AE6-\u2AE9\u2AEB-\u2AF3\u2AFD\uFB00-\uFB04]|\uD835[\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDD6B]/g;
      var encodeMap = { "\xAD": "shy", "\u200C": "zwnj", "\u200D": "zwj", "\u200E": "lrm", "\u2063": "ic", "\u2062": "it", "\u2061": "af", "\u200F": "rlm", "\u200B": "ZeroWidthSpace", "\u2060": "NoBreak", "\u0311": "DownBreve", "\u20DB": "tdot", "\u20DC": "DotDot", "	": "Tab", "\n": "NewLine", "\u2008": "puncsp", "\u205F": "MediumSpace", "\u2009": "thinsp", "\u200A": "hairsp", "\u2004": "emsp13", "\u2002": "ensp", "\u2005": "emsp14", "\u2003": "emsp", "\u2007": "numsp", "\xA0": "nbsp", "\u205F\u200A": "ThickSpace", "\u203E": "oline", "_": "lowbar", "\u2010": "dash", "\u2013": "ndash", "\u2014": "mdash", "\u2015": "horbar", ",": "comma", ";": "semi", "\u204F": "bsemi", ":": "colon", "\u2A74": "Colone", "!": "excl", "\xA1": "iexcl", "?": "quest", "\xBF": "iquest", ".": "period", "\u2025": "nldr", "\u2026": "mldr", "\xB7": "middot", "'": "apos", "\u2018": "lsquo", "\u2019": "rsquo", "\u201A": "sbquo", "\u2039": "lsaquo", "\u203A": "rsaquo", '"': "quot", "\u201C": "ldquo", "\u201D": "rdquo", "\u201E": "bdquo", "\xAB": "laquo", "\xBB": "raquo", "(": "lpar", ")": "rpar", "[": "lsqb", "]": "rsqb", "{": "lcub", "}": "rcub", "\u2308": "lceil", "\u2309": "rceil", "\u230A": "lfloor", "\u230B": "rfloor", "\u2985": "lopar", "\u2986": "ropar", "\u298B": "lbrke", "\u298C": "rbrke", "\u298D": "lbrkslu", "\u298E": "rbrksld", "\u298F": "lbrksld", "\u2990": "rbrkslu", "\u2991": "langd", "\u2992": "rangd", "\u2993": "lparlt", "\u2994": "rpargt", "\u2995": "gtlPar", "\u2996": "ltrPar", "\u27E6": "lobrk", "\u27E7": "robrk", "\u27E8": "lang", "\u27E9": "rang", "\u27EA": "Lang", "\u27EB": "Rang", "\u27EC": "loang", "\u27ED": "roang", "\u2772": "lbbrk", "\u2773": "rbbrk", "\u2016": "Vert", "\xA7": "sect", "\xB6": "para", "@": "commat", "*": "ast", "/": "sol", "undefined": null, "&": "amp", "#": "num", "%": "percnt", "\u2030": "permil", "\u2031": "pertenk", "\u2020": "dagger", "\u2021": "Dagger", "\u2022": "bull", "\u2043": "hybull", "\u2032": "prime", "\u2033": "Prime", "\u2034": "tprime", "\u2057": "qprime", "\u2035": "bprime", "\u2041": "caret", "`": "grave", "\xB4": "acute", "\u02DC": "tilde", "^": "Hat", "\xAF": "macr", "\u02D8": "breve", "\u02D9": "dot", "\xA8": "die", "\u02DA": "ring", "\u02DD": "dblac", "\xB8": "cedil", "\u02DB": "ogon", "\u02C6": "circ", "\u02C7": "caron", "\xB0": "deg", "\xA9": "copy", "\xAE": "reg", "\u2117": "copysr", "\u2118": "wp", "\u211E": "rx", "\u2127": "mho", "\u2129": "iiota", "\u2190": "larr", "\u219A": "nlarr", "\u2192": "rarr", "\u219B": "nrarr", "\u2191": "uarr", "\u2193": "darr", "\u2194": "harr", "\u21AE": "nharr", "\u2195": "varr", "\u2196": "nwarr", "\u2197": "nearr", "\u2198": "searr", "\u2199": "swarr", "\u219D": "rarrw", "\u219D\u0338": "nrarrw", "\u219E": "Larr", "\u219F": "Uarr", "\u21A0": "Rarr", "\u21A1": "Darr", "\u21A2": "larrtl", "\u21A3": "rarrtl", "\u21A4": "mapstoleft", "\u21A5": "mapstoup", "\u21A6": "map", "\u21A7": "mapstodown", "\u21A9": "larrhk", "\u21AA": "rarrhk", "\u21AB": "larrlp", "\u21AC": "rarrlp", "\u21AD": "harrw", "\u21B0": "lsh", "\u21B1": "rsh", "\u21B2": "ldsh", "\u21B3": "rdsh", "\u21B5": "crarr", "\u21B6": "cularr", "\u21B7": "curarr", "\u21BA": "olarr", "\u21BB": "orarr", "\u21BC": "lharu", "\u21BD": "lhard", "\u21BE": "uharr", "\u21BF": "uharl", "\u21C0": "rharu", "\u21C1": "rhard", "\u21C2": "dharr", "\u21C3": "dharl", "\u21C4": "rlarr", "\u21C5": "udarr", "\u21C6": "lrarr", "\u21C7": "llarr", "\u21C8": "uuarr", "\u21C9": "rrarr", "\u21CA": "ddarr", "\u21CB": "lrhar", "\u21CC": "rlhar", "\u21D0": "lArr", "\u21CD": "nlArr", "\u21D1": "uArr", "\u21D2": "rArr", "\u21CF": "nrArr", "\u21D3": "dArr", "\u21D4": "iff", "\u21CE": "nhArr", "\u21D5": "vArr", "\u21D6": "nwArr", "\u21D7": "neArr", "\u21D8": "seArr", "\u21D9": "swArr", "\u21DA": "lAarr", "\u21DB": "rAarr", "\u21DD": "zigrarr", "\u21E4": "larrb", "\u21E5": "rarrb", "\u21F5": "duarr", "\u21FD": "loarr", "\u21FE": "roarr", "\u21FF": "hoarr", "\u2200": "forall", "\u2201": "comp", "\u2202": "part", "\u2202\u0338": "npart", "\u2203": "exist", "\u2204": "nexist", "\u2205": "empty", "\u2207": "Del", "\u2208": "in", "\u2209": "notin", "\u220B": "ni", "\u220C": "notni", "\u03F6": "bepsi", "\u220F": "prod", "\u2210": "coprod", "\u2211": "sum", "+": "plus", "\xB1": "pm", "\xF7": "div", "\xD7": "times", "<": "lt", "\u226E": "nlt", "<\u20D2": "nvlt", "=": "equals", "\u2260": "ne", "=\u20E5": "bne", "\u2A75": "Equal", ">": "gt", "\u226F": "ngt", ">\u20D2": "nvgt", "\xAC": "not", "|": "vert", "\xA6": "brvbar", "\u2212": "minus", "\u2213": "mp", "\u2214": "plusdo", "\u2044": "frasl", "\u2216": "setmn", "\u2217": "lowast", "\u2218": "compfn", "\u221A": "Sqrt", "\u221D": "prop", "\u221E": "infin", "\u221F": "angrt", "\u2220": "ang", "\u2220\u20D2": "nang", "\u2221": "angmsd", "\u2222": "angsph", "\u2223": "mid", "\u2224": "nmid", "\u2225": "par", "\u2226": "npar", "\u2227": "and", "\u2228": "or", "\u2229": "cap", "\u2229\uFE00": "caps", "\u222A": "cup", "\u222A\uFE00": "cups", "\u222B": "int", "\u222C": "Int", "\u222D": "tint", "\u2A0C": "qint", "\u222E": "oint", "\u222F": "Conint", "\u2230": "Cconint", "\u2231": "cwint", "\u2232": "cwconint", "\u2233": "awconint", "\u2234": "there4", "\u2235": "becaus", "\u2236": "ratio", "\u2237": "Colon", "\u2238": "minusd", "\u223A": "mDDot", "\u223B": "homtht", "\u223C": "sim", "\u2241": "nsim", "\u223C\u20D2": "nvsim", "\u223D": "bsim", "\u223D\u0331": "race", "\u223E": "ac", "\u223E\u0333": "acE", "\u223F": "acd", "\u2240": "wr", "\u2242": "esim", "\u2242\u0338": "nesim", "\u2243": "sime", "\u2244": "nsime", "\u2245": "cong", "\u2247": "ncong", "\u2246": "simne", "\u2248": "ap", "\u2249": "nap", "\u224A": "ape", "\u224B": "apid", "\u224B\u0338": "napid", "\u224C": "bcong", "\u224D": "CupCap", "\u226D": "NotCupCap", "\u224D\u20D2": "nvap", "\u224E": "bump", "\u224E\u0338": "nbump", "\u224F": "bumpe", "\u224F\u0338": "nbumpe", "\u2250": "doteq", "\u2250\u0338": "nedot", "\u2251": "eDot", "\u2252": "efDot", "\u2253": "erDot", "\u2254": "colone", "\u2255": "ecolon", "\u2256": "ecir", "\u2257": "cire", "\u2259": "wedgeq", "\u225A": "veeeq", "\u225C": "trie", "\u225F": "equest", "\u2261": "equiv", "\u2262": "nequiv", "\u2261\u20E5": "bnequiv", "\u2264": "le", "\u2270": "nle", "\u2264\u20D2": "nvle", "\u2265": "ge", "\u2271": "nge", "\u2265\u20D2": "nvge", "\u2266": "lE", "\u2266\u0338": "nlE", "\u2267": "gE", "\u2267\u0338": "ngE", "\u2268\uFE00": "lvnE", "\u2268": "lnE", "\u2269": "gnE", "\u2269\uFE00": "gvnE", "\u226A": "ll", "\u226A\u0338": "nLtv", "\u226A\u20D2": "nLt", "\u226B": "gg", "\u226B\u0338": "nGtv", "\u226B\u20D2": "nGt", "\u226C": "twixt", "\u2272": "lsim", "\u2274": "nlsim", "\u2273": "gsim", "\u2275": "ngsim", "\u2276": "lg", "\u2278": "ntlg", "\u2277": "gl", "\u2279": "ntgl", "\u227A": "pr", "\u2280": "npr", "\u227B": "sc", "\u2281": "nsc", "\u227C": "prcue", "\u22E0": "nprcue", "\u227D": "sccue", "\u22E1": "nsccue", "\u227E": "prsim", "\u227F": "scsim", "\u227F\u0338": "NotSucceedsTilde", "\u2282": "sub", "\u2284": "nsub", "\u2282\u20D2": "vnsub", "\u2283": "sup", "\u2285": "nsup", "\u2283\u20D2": "vnsup", "\u2286": "sube", "\u2288": "nsube", "\u2287": "supe", "\u2289": "nsupe", "\u228A\uFE00": "vsubne", "\u228A": "subne", "\u228B\uFE00": "vsupne", "\u228B": "supne", "\u228D": "cupdot", "\u228E": "uplus", "\u228F": "sqsub", "\u228F\u0338": "NotSquareSubset", "\u2290": "sqsup", "\u2290\u0338": "NotSquareSuperset", "\u2291": "sqsube", "\u22E2": "nsqsube", "\u2292": "sqsupe", "\u22E3": "nsqsupe", "\u2293": "sqcap", "\u2293\uFE00": "sqcaps", "\u2294": "sqcup", "\u2294\uFE00": "sqcups", "\u2295": "oplus", "\u2296": "ominus", "\u2297": "otimes", "\u2298": "osol", "\u2299": "odot", "\u229A": "ocir", "\u229B": "oast", "\u229D": "odash", "\u229E": "plusb", "\u229F": "minusb", "\u22A0": "timesb", "\u22A1": "sdotb", "\u22A2": "vdash", "\u22AC": "nvdash", "\u22A3": "dashv", "\u22A4": "top", "\u22A5": "bot", "\u22A7": "models", "\u22A8": "vDash", "\u22AD": "nvDash", "\u22A9": "Vdash", "\u22AE": "nVdash", "\u22AA": "Vvdash", "\u22AB": "VDash", "\u22AF": "nVDash", "\u22B0": "prurel", "\u22B2": "vltri", "\u22EA": "nltri", "\u22B3": "vrtri", "\u22EB": "nrtri", "\u22B4": "ltrie", "\u22EC": "nltrie", "\u22B4\u20D2": "nvltrie", "\u22B5": "rtrie", "\u22ED": "nrtrie", "\u22B5\u20D2": "nvrtrie", "\u22B6": "origof", "\u22B7": "imof", "\u22B8": "mumap", "\u22B9": "hercon", "\u22BA": "intcal", "\u22BB": "veebar", "\u22BD": "barvee", "\u22BE": "angrtvb", "\u22BF": "lrtri", "\u22C0": "Wedge", "\u22C1": "Vee", "\u22C2": "xcap", "\u22C3": "xcup", "\u22C4": "diam", "\u22C5": "sdot", "\u22C6": "Star", "\u22C7": "divonx", "\u22C8": "bowtie", "\u22C9": "ltimes", "\u22CA": "rtimes", "\u22CB": "lthree", "\u22CC": "rthree", "\u22CD": "bsime", "\u22CE": "cuvee", "\u22CF": "cuwed", "\u22D0": "Sub", "\u22D1": "Sup", "\u22D2": "Cap", "\u22D3": "Cup", "\u22D4": "fork", "\u22D5": "epar", "\u22D6": "ltdot", "\u22D7": "gtdot", "\u22D8": "Ll", "\u22D8\u0338": "nLl", "\u22D9": "Gg", "\u22D9\u0338": "nGg", "\u22DA\uFE00": "lesg", "\u22DA": "leg", "\u22DB": "gel", "\u22DB\uFE00": "gesl", "\u22DE": "cuepr", "\u22DF": "cuesc", "\u22E6": "lnsim", "\u22E7": "gnsim", "\u22E8": "prnsim", "\u22E9": "scnsim", "\u22EE": "vellip", "\u22EF": "ctdot", "\u22F0": "utdot", "\u22F1": "dtdot", "\u22F2": "disin", "\u22F3": "isinsv", "\u22F4": "isins", "\u22F5": "isindot", "\u22F5\u0338": "notindot", "\u22F6": "notinvc", "\u22F7": "notinvb", "\u22F9": "isinE", "\u22F9\u0338": "notinE", "\u22FA": "nisd", "\u22FB": "xnis", "\u22FC": "nis", "\u22FD": "notnivc", "\u22FE": "notnivb", "\u2305": "barwed", "\u2306": "Barwed", "\u230C": "drcrop", "\u230D": "dlcrop", "\u230E": "urcrop", "\u230F": "ulcrop", "\u2310": "bnot", "\u2312": "profline", "\u2313": "profsurf", "\u2315": "telrec", "\u2316": "target", "\u231C": "ulcorn", "\u231D": "urcorn", "\u231E": "dlcorn", "\u231F": "drcorn", "\u2322": "frown", "\u2323": "smile", "\u232D": "cylcty", "\u232E": "profalar", "\u2336": "topbot", "\u233D": "ovbar", "\u233F": "solbar", "\u237C": "angzarr", "\u23B0": "lmoust", "\u23B1": "rmoust", "\u23B4": "tbrk", "\u23B5": "bbrk", "\u23B6": "bbrktbrk", "\u23DC": "OverParenthesis", "\u23DD": "UnderParenthesis", "\u23DE": "OverBrace", "\u23DF": "UnderBrace", "\u23E2": "trpezium", "\u23E7": "elinters", "\u2423": "blank", "\u2500": "boxh", "\u2502": "boxv", "\u250C": "boxdr", "\u2510": "boxdl", "\u2514": "boxur", "\u2518": "boxul", "\u251C": "boxvr", "\u2524": "boxvl", "\u252C": "boxhd", "\u2534": "boxhu", "\u253C": "boxvh", "\u2550": "boxH", "\u2551": "boxV", "\u2552": "boxdR", "\u2553": "boxDr", "\u2554": "boxDR", "\u2555": "boxdL", "\u2556": "boxDl", "\u2557": "boxDL", "\u2558": "boxuR", "\u2559": "boxUr", "\u255A": "boxUR", "\u255B": "boxuL", "\u255C": "boxUl", "\u255D": "boxUL", "\u255E": "boxvR", "\u255F": "boxVr", "\u2560": "boxVR", "\u2561": "boxvL", "\u2562": "boxVl", "\u2563": "boxVL", "\u2564": "boxHd", "\u2565": "boxhD", "\u2566": "boxHD", "\u2567": "boxHu", "\u2568": "boxhU", "\u2569": "boxHU", "\u256A": "boxvH", "\u256B": "boxVh", "\u256C": "boxVH", "\u2580": "uhblk", "\u2584": "lhblk", "\u2588": "block", "\u2591": "blk14", "\u2592": "blk12", "\u2593": "blk34", "\u25A1": "squ", "\u25AA": "squf", "\u25AB": "EmptyVerySmallSquare", "\u25AD": "rect", "\u25AE": "marker", "\u25B1": "fltns", "\u25B3": "xutri", "\u25B4": "utrif", "\u25B5": "utri", "\u25B8": "rtrif", "\u25B9": "rtri", "\u25BD": "xdtri", "\u25BE": "dtrif", "\u25BF": "dtri", "\u25C2": "ltrif", "\u25C3": "ltri", "\u25CA": "loz", "\u25CB": "cir", "\u25EC": "tridot", "\u25EF": "xcirc", "\u25F8": "ultri", "\u25F9": "urtri", "\u25FA": "lltri", "\u25FB": "EmptySmallSquare", "\u25FC": "FilledSmallSquare", "\u2605": "starf", "\u2606": "star", "\u260E": "phone", "\u2640": "female", "\u2642": "male", "\u2660": "spades", "\u2663": "clubs", "\u2665": "hearts", "\u2666": "diams", "\u266A": "sung", "\u2713": "check", "\u2717": "cross", "\u2720": "malt", "\u2736": "sext", "\u2758": "VerticalSeparator", "\u27C8": "bsolhsub", "\u27C9": "suphsol", "\u27F5": "xlarr", "\u27F6": "xrarr", "\u27F7": "xharr", "\u27F8": "xlArr", "\u27F9": "xrArr", "\u27FA": "xhArr", "\u27FC": "xmap", "\u27FF": "dzigrarr", "\u2902": "nvlArr", "\u2903": "nvrArr", "\u2904": "nvHarr", "\u2905": "Map", "\u290C": "lbarr", "\u290D": "rbarr", "\u290E": "lBarr", "\u290F": "rBarr", "\u2910": "RBarr", "\u2911": "DDotrahd", "\u2912": "UpArrowBar", "\u2913": "DownArrowBar", "\u2916": "Rarrtl", "\u2919": "latail", "\u291A": "ratail", "\u291B": "lAtail", "\u291C": "rAtail", "\u291D": "larrfs", "\u291E": "rarrfs", "\u291F": "larrbfs", "\u2920": "rarrbfs", "\u2923": "nwarhk", "\u2924": "nearhk", "\u2925": "searhk", "\u2926": "swarhk", "\u2927": "nwnear", "\u2928": "toea", "\u2929": "tosa", "\u292A": "swnwar", "\u2933": "rarrc", "\u2933\u0338": "nrarrc", "\u2935": "cudarrr", "\u2936": "ldca", "\u2937": "rdca", "\u2938": "cudarrl", "\u2939": "larrpl", "\u293C": "curarrm", "\u293D": "cularrp", "\u2945": "rarrpl", "\u2948": "harrcir", "\u2949": "Uarrocir", "\u294A": "lurdshar", "\u294B": "ldrushar", "\u294E": "LeftRightVector", "\u294F": "RightUpDownVector", "\u2950": "DownLeftRightVector", "\u2951": "LeftUpDownVector", "\u2952": "LeftVectorBar", "\u2953": "RightVectorBar", "\u2954": "RightUpVectorBar", "\u2955": "RightDownVectorBar", "\u2956": "DownLeftVectorBar", "\u2957": "DownRightVectorBar", "\u2958": "LeftUpVectorBar", "\u2959": "LeftDownVectorBar", "\u295A": "LeftTeeVector", "\u295B": "RightTeeVector", "\u295C": "RightUpTeeVector", "\u295D": "RightDownTeeVector", "\u295E": "DownLeftTeeVector", "\u295F": "DownRightTeeVector", "\u2960": "LeftUpTeeVector", "\u2961": "LeftDownTeeVector", "\u2962": "lHar", "\u2963": "uHar", "\u2964": "rHar", "\u2965": "dHar", "\u2966": "luruhar", "\u2967": "ldrdhar", "\u2968": "ruluhar", "\u2969": "rdldhar", "\u296A": "lharul", "\u296B": "llhard", "\u296C": "rharul", "\u296D": "lrhard", "\u296E": "udhar", "\u296F": "duhar", "\u2970": "RoundImplies", "\u2971": "erarr", "\u2972": "simrarr", "\u2973": "larrsim", "\u2974": "rarrsim", "\u2975": "rarrap", "\u2976": "ltlarr", "\u2978": "gtrarr", "\u2979": "subrarr", "\u297B": "suplarr", "\u297C": "lfisht", "\u297D": "rfisht", "\u297E": "ufisht", "\u297F": "dfisht", "\u299A": "vzigzag", "\u299C": "vangrt", "\u299D": "angrtvbd", "\u29A4": "ange", "\u29A5": "range", "\u29A6": "dwangle", "\u29A7": "uwangle", "\u29A8": "angmsdaa", "\u29A9": "angmsdab", "\u29AA": "angmsdac", "\u29AB": "angmsdad", "\u29AC": "angmsdae", "\u29AD": "angmsdaf", "\u29AE": "angmsdag", "\u29AF": "angmsdah", "\u29B0": "bemptyv", "\u29B1": "demptyv", "\u29B2": "cemptyv", "\u29B3": "raemptyv", "\u29B4": "laemptyv", "\u29B5": "ohbar", "\u29B6": "omid", "\u29B7": "opar", "\u29B9": "operp", "\u29BB": "olcross", "\u29BC": "odsold", "\u29BE": "olcir", "\u29BF": "ofcir", "\u29C0": "olt", "\u29C1": "ogt", "\u29C2": "cirscir", "\u29C3": "cirE", "\u29C4": "solb", "\u29C5": "bsolb", "\u29C9": "boxbox", "\u29CD": "trisb", "\u29CE": "rtriltri", "\u29CF": "LeftTriangleBar", "\u29CF\u0338": "NotLeftTriangleBar", "\u29D0": "RightTriangleBar", "\u29D0\u0338": "NotRightTriangleBar", "\u29DC": "iinfin", "\u29DD": "infintie", "\u29DE": "nvinfin", "\u29E3": "eparsl", "\u29E4": "smeparsl", "\u29E5": "eqvparsl", "\u29EB": "lozf", "\u29F4": "RuleDelayed", "\u29F6": "dsol", "\u2A00": "xodot", "\u2A01": "xoplus", "\u2A02": "xotime", "\u2A04": "xuplus", "\u2A06": "xsqcup", "\u2A0D": "fpartint", "\u2A10": "cirfnint", "\u2A11": "awint", "\u2A12": "rppolint", "\u2A13": "scpolint", "\u2A14": "npolint", "\u2A15": "pointint", "\u2A16": "quatint", "\u2A17": "intlarhk", "\u2A22": "pluscir", "\u2A23": "plusacir", "\u2A24": "simplus", "\u2A25": "plusdu", "\u2A26": "plussim", "\u2A27": "plustwo", "\u2A29": "mcomma", "\u2A2A": "minusdu", "\u2A2D": "loplus", "\u2A2E": "roplus", "\u2A2F": "Cross", "\u2A30": "timesd", "\u2A31": "timesbar", "\u2A33": "smashp", "\u2A34": "lotimes", "\u2A35": "rotimes", "\u2A36": "otimesas", "\u2A37": "Otimes", "\u2A38": "odiv", "\u2A39": "triplus", "\u2A3A": "triminus", "\u2A3B": "tritime", "\u2A3C": "iprod", "\u2A3F": "amalg", "\u2A40": "capdot", "\u2A42": "ncup", "\u2A43": "ncap", "\u2A44": "capand", "\u2A45": "cupor", "\u2A46": "cupcap", "\u2A47": "capcup", "\u2A48": "cupbrcap", "\u2A49": "capbrcup", "\u2A4A": "cupcup", "\u2A4B": "capcap", "\u2A4C": "ccups", "\u2A4D": "ccaps", "\u2A50": "ccupssm", "\u2A53": "And", "\u2A54": "Or", "\u2A55": "andand", "\u2A56": "oror", "\u2A57": "orslope", "\u2A58": "andslope", "\u2A5A": "andv", "\u2A5B": "orv", "\u2A5C": "andd", "\u2A5D": "ord", "\u2A5F": "wedbar", "\u2A66": "sdote", "\u2A6A": "simdot", "\u2A6D": "congdot", "\u2A6D\u0338": "ncongdot", "\u2A6E": "easter", "\u2A6F": "apacir", "\u2A70": "apE", "\u2A70\u0338": "napE", "\u2A71": "eplus", "\u2A72": "pluse", "\u2A73": "Esim", "\u2A77": "eDDot", "\u2A78": "equivDD", "\u2A79": "ltcir", "\u2A7A": "gtcir", "\u2A7B": "ltquest", "\u2A7C": "gtquest", "\u2A7D": "les", "\u2A7D\u0338": "nles", "\u2A7E": "ges", "\u2A7E\u0338": "nges", "\u2A7F": "lesdot", "\u2A80": "gesdot", "\u2A81": "lesdoto", "\u2A82": "gesdoto", "\u2A83": "lesdotor", "\u2A84": "gesdotol", "\u2A85": "lap", "\u2A86": "gap", "\u2A87": "lne", "\u2A88": "gne", "\u2A89": "lnap", "\u2A8A": "gnap", "\u2A8B": "lEg", "\u2A8C": "gEl", "\u2A8D": "lsime", "\u2A8E": "gsime", "\u2A8F": "lsimg", "\u2A90": "gsiml", "\u2A91": "lgE", "\u2A92": "glE", "\u2A93": "lesges", "\u2A94": "gesles", "\u2A95": "els", "\u2A96": "egs", "\u2A97": "elsdot", "\u2A98": "egsdot", "\u2A99": "el", "\u2A9A": "eg", "\u2A9D": "siml", "\u2A9E": "simg", "\u2A9F": "simlE", "\u2AA0": "simgE", "\u2AA1": "LessLess", "\u2AA1\u0338": "NotNestedLessLess", "\u2AA2": "GreaterGreater", "\u2AA2\u0338": "NotNestedGreaterGreater", "\u2AA4": "glj", "\u2AA5": "gla", "\u2AA6": "ltcc", "\u2AA7": "gtcc", "\u2AA8": "lescc", "\u2AA9": "gescc", "\u2AAA": "smt", "\u2AAB": "lat", "\u2AAC": "smte", "\u2AAC\uFE00": "smtes", "\u2AAD": "late", "\u2AAD\uFE00": "lates", "\u2AAE": "bumpE", "\u2AAF": "pre", "\u2AAF\u0338": "npre", "\u2AB0": "sce", "\u2AB0\u0338": "nsce", "\u2AB3": "prE", "\u2AB4": "scE", "\u2AB5": "prnE", "\u2AB6": "scnE", "\u2AB7": "prap", "\u2AB8": "scap", "\u2AB9": "prnap", "\u2ABA": "scnap", "\u2ABB": "Pr", "\u2ABC": "Sc", "\u2ABD": "subdot", "\u2ABE": "supdot", "\u2ABF": "subplus", "\u2AC0": "supplus", "\u2AC1": "submult", "\u2AC2": "supmult", "\u2AC3": "subedot", "\u2AC4": "supedot", "\u2AC5": "subE", "\u2AC5\u0338": "nsubE", "\u2AC6": "supE", "\u2AC6\u0338": "nsupE", "\u2AC7": "subsim", "\u2AC8": "supsim", "\u2ACB\uFE00": "vsubnE", "\u2ACB": "subnE", "\u2ACC\uFE00": "vsupnE", "\u2ACC": "supnE", "\u2ACF": "csub", "\u2AD0": "csup", "\u2AD1": "csube", "\u2AD2": "csupe", "\u2AD3": "subsup", "\u2AD4": "supsub", "\u2AD5": "subsub", "\u2AD6": "supsup", "\u2AD7": "suphsub", "\u2AD8": "supdsub", "\u2AD9": "forkv", "\u2ADA": "topfork", "\u2ADB": "mlcp", "\u2AE4": "Dashv", "\u2AE6": "Vdashl", "\u2AE7": "Barv", "\u2AE8": "vBar", "\u2AE9": "vBarv", "\u2AEB": "Vbar", "\u2AEC": "Not", "\u2AED": "bNot", "\u2AEE": "rnmid", "\u2AEF": "cirmid", "\u2AF0": "midcir", "\u2AF1": "topcir", "\u2AF2": "nhpar", "\u2AF3": "parsim", "\u2AFD": "parsl", "\u2AFD\u20E5": "nparsl", "\u266D": "flat", "\u266E": "natur", "\u266F": "sharp", "\xA4": "curren", "\xA2": "cent", "$": "dollar", "\xA3": "pound", "\xA5": "yen", "\u20AC": "euro", "\xB9": "sup1", "\xBD": "half", "\u2153": "frac13", "\xBC": "frac14", "\u2155": "frac15", "\u2159": "frac16", "\u215B": "frac18", "\xB2": "sup2", "\u2154": "frac23", "\u2156": "frac25", "\xB3": "sup3", "\xBE": "frac34", "\u2157": "frac35", "\u215C": "frac38", "\u2158": "frac45", "\u215A": "frac56", "\u215D": "frac58", "\u215E": "frac78", "\u{1D4B6}": "ascr", "\u{1D552}": "aopf", "\u{1D51E}": "afr", "\u{1D538}": "Aopf", "\u{1D504}": "Afr", "\u{1D49C}": "Ascr", "\xAA": "ordf", "\xE1": "aacute", "\xC1": "Aacute", "\xE0": "agrave", "\xC0": "Agrave", "\u0103": "abreve", "\u0102": "Abreve", "\xE2": "acirc", "\xC2": "Acirc", "\xE5": "aring", "\xC5": "angst", "\xE4": "auml", "\xC4": "Auml", "\xE3": "atilde", "\xC3": "Atilde", "\u0105": "aogon", "\u0104": "Aogon", "\u0101": "amacr", "\u0100": "Amacr", "\xE6": "aelig", "\xC6": "AElig", "\u{1D4B7}": "bscr", "\u{1D553}": "bopf", "\u{1D51F}": "bfr", "\u{1D539}": "Bopf", "\u212C": "Bscr", "\u{1D505}": "Bfr", "\u{1D520}": "cfr", "\u{1D4B8}": "cscr", "\u{1D554}": "copf", "\u212D": "Cfr", "\u{1D49E}": "Cscr", "\u2102": "Copf", "\u0107": "cacute", "\u0106": "Cacute", "\u0109": "ccirc", "\u0108": "Ccirc", "\u010D": "ccaron", "\u010C": "Ccaron", "\u010B": "cdot", "\u010A": "Cdot", "\xE7": "ccedil", "\xC7": "Ccedil", "\u2105": "incare", "\u{1D521}": "dfr", "\u2146": "dd", "\u{1D555}": "dopf", "\u{1D4B9}": "dscr", "\u{1D49F}": "Dscr", "\u{1D507}": "Dfr", "\u2145": "DD", "\u{1D53B}": "Dopf", "\u010F": "dcaron", "\u010E": "Dcaron", "\u0111": "dstrok", "\u0110": "Dstrok", "\xF0": "eth", "\xD0": "ETH", "\u2147": "ee", "\u212F": "escr", "\u{1D522}": "efr", "\u{1D556}": "eopf", "\u2130": "Escr", "\u{1D508}": "Efr", "\u{1D53C}": "Eopf", "\xE9": "eacute", "\xC9": "Eacute", "\xE8": "egrave", "\xC8": "Egrave", "\xEA": "ecirc", "\xCA": "Ecirc", "\u011B": "ecaron", "\u011A": "Ecaron", "\xEB": "euml", "\xCB": "Euml", "\u0117": "edot", "\u0116": "Edot", "\u0119": "eogon", "\u0118": "Eogon", "\u0113": "emacr", "\u0112": "Emacr", "\u{1D523}": "ffr", "\u{1D557}": "fopf", "\u{1D4BB}": "fscr", "\u{1D509}": "Ffr", "\u{1D53D}": "Fopf", "\u2131": "Fscr", "\uFB00": "fflig", "\uFB03": "ffilig", "\uFB04": "ffllig", "\uFB01": "filig", "fj": "fjlig", "\uFB02": "fllig", "\u0192": "fnof", "\u210A": "gscr", "\u{1D558}": "gopf", "\u{1D524}": "gfr", "\u{1D4A2}": "Gscr", "\u{1D53E}": "Gopf", "\u{1D50A}": "Gfr", "\u01F5": "gacute", "\u011F": "gbreve", "\u011E": "Gbreve", "\u011D": "gcirc", "\u011C": "Gcirc", "\u0121": "gdot", "\u0120": "Gdot", "\u0122": "Gcedil", "\u{1D525}": "hfr", "\u210E": "planckh", "\u{1D4BD}": "hscr", "\u{1D559}": "hopf", "\u210B": "Hscr", "\u210C": "Hfr", "\u210D": "Hopf", "\u0125": "hcirc", "\u0124": "Hcirc", "\u210F": "hbar", "\u0127": "hstrok", "\u0126": "Hstrok", "\u{1D55A}": "iopf", "\u{1D526}": "ifr", "\u{1D4BE}": "iscr", "\u2148": "ii", "\u{1D540}": "Iopf", "\u2110": "Iscr", "\u2111": "Im", "\xED": "iacute", "\xCD": "Iacute", "\xEC": "igrave", "\xCC": "Igrave", "\xEE": "icirc", "\xCE": "Icirc", "\xEF": "iuml", "\xCF": "Iuml", "\u0129": "itilde", "\u0128": "Itilde", "\u0130": "Idot", "\u012F": "iogon", "\u012E": "Iogon", "\u012B": "imacr", "\u012A": "Imacr", "\u0133": "ijlig", "\u0132": "IJlig", "\u0131": "imath", "\u{1D4BF}": "jscr", "\u{1D55B}": "jopf", "\u{1D527}": "jfr", "\u{1D4A5}": "Jscr", "\u{1D50D}": "Jfr", "\u{1D541}": "Jopf", "\u0135": "jcirc", "\u0134": "Jcirc", "\u0237": "jmath", "\u{1D55C}": "kopf", "\u{1D4C0}": "kscr", "\u{1D528}": "kfr", "\u{1D4A6}": "Kscr", "\u{1D542}": "Kopf", "\u{1D50E}": "Kfr", "\u0137": "kcedil", "\u0136": "Kcedil", "\u{1D529}": "lfr", "\u{1D4C1}": "lscr", "\u2113": "ell", "\u{1D55D}": "lopf", "\u2112": "Lscr", "\u{1D50F}": "Lfr", "\u{1D543}": "Lopf", "\u013A": "lacute", "\u0139": "Lacute", "\u013E": "lcaron", "\u013D": "Lcaron", "\u013C": "lcedil", "\u013B": "Lcedil", "\u0142": "lstrok", "\u0141": "Lstrok", "\u0140": "lmidot", "\u013F": "Lmidot", "\u{1D52A}": "mfr", "\u{1D55E}": "mopf", "\u{1D4C2}": "mscr", "\u{1D510}": "Mfr", "\u{1D544}": "Mopf", "\u2133": "Mscr", "\u{1D52B}": "nfr", "\u{1D55F}": "nopf", "\u{1D4C3}": "nscr", "\u2115": "Nopf", "\u{1D4A9}": "Nscr", "\u{1D511}": "Nfr", "\u0144": "nacute", "\u0143": "Nacute", "\u0148": "ncaron", "\u0147": "Ncaron", "\xF1": "ntilde", "\xD1": "Ntilde", "\u0146": "ncedil", "\u0145": "Ncedil", "\u2116": "numero", "\u014B": "eng", "\u014A": "ENG", "\u{1D560}": "oopf", "\u{1D52C}": "ofr", "\u2134": "oscr", "\u{1D4AA}": "Oscr", "\u{1D512}": "Ofr", "\u{1D546}": "Oopf", "\xBA": "ordm", "\xF3": "oacute", "\xD3": "Oacute", "\xF2": "ograve", "\xD2": "Ograve", "\xF4": "ocirc", "\xD4": "Ocirc", "\xF6": "ouml", "\xD6": "Ouml", "\u0151": "odblac", "\u0150": "Odblac", "\xF5": "otilde", "\xD5": "Otilde", "\xF8": "oslash", "\xD8": "Oslash", "\u014D": "omacr", "\u014C": "Omacr", "\u0153": "oelig", "\u0152": "OElig", "\u{1D52D}": "pfr", "\u{1D4C5}": "pscr", "\u{1D561}": "popf", "\u2119": "Popf", "\u{1D513}": "Pfr", "\u{1D4AB}": "Pscr", "\u{1D562}": "qopf", "\u{1D52E}": "qfr", "\u{1D4C6}": "qscr", "\u{1D4AC}": "Qscr", "\u{1D514}": "Qfr", "\u211A": "Qopf", "\u0138": "kgreen", "\u{1D52F}": "rfr", "\u{1D563}": "ropf", "\u{1D4C7}": "rscr", "\u211B": "Rscr", "\u211C": "Re", "\u211D": "Ropf", "\u0155": "racute", "\u0154": "Racute", "\u0159": "rcaron", "\u0158": "Rcaron", "\u0157": "rcedil", "\u0156": "Rcedil", "\u{1D564}": "sopf", "\u{1D4C8}": "sscr", "\u{1D530}": "sfr", "\u{1D54A}": "Sopf", "\u{1D516}": "Sfr", "\u{1D4AE}": "Sscr", "\u24C8": "oS", "\u015B": "sacute", "\u015A": "Sacute", "\u015D": "scirc", "\u015C": "Scirc", "\u0161": "scaron", "\u0160": "Scaron", "\u015F": "scedil", "\u015E": "Scedil", "\xDF": "szlig", "\u{1D531}": "tfr", "\u{1D4C9}": "tscr", "\u{1D565}": "topf", "\u{1D4AF}": "Tscr", "\u{1D517}": "Tfr", "\u{1D54B}": "Topf", "\u0165": "tcaron", "\u0164": "Tcaron", "\u0163": "tcedil", "\u0162": "Tcedil", "\u2122": "trade", "\u0167": "tstrok", "\u0166": "Tstrok", "\u{1D4CA}": "uscr", "\u{1D566}": "uopf", "\u{1D532}": "ufr", "\u{1D54C}": "Uopf", "\u{1D518}": "Ufr", "\u{1D4B0}": "Uscr", "\xFA": "uacute", "\xDA": "Uacute", "\xF9": "ugrave", "\xD9": "Ugrave", "\u016D": "ubreve", "\u016C": "Ubreve", "\xFB": "ucirc", "\xDB": "Ucirc", "\u016F": "uring", "\u016E": "Uring", "\xFC": "uuml", "\xDC": "Uuml", "\u0171": "udblac", "\u0170": "Udblac", "\u0169": "utilde", "\u0168": "Utilde", "\u0173": "uogon", "\u0172": "Uogon", "\u016B": "umacr", "\u016A": "Umacr", "\u{1D533}": "vfr", "\u{1D567}": "vopf", "\u{1D4CB}": "vscr", "\u{1D519}": "Vfr", "\u{1D54D}": "Vopf", "\u{1D4B1}": "Vscr", "\u{1D568}": "wopf", "\u{1D4CC}": "wscr", "\u{1D534}": "wfr", "\u{1D4B2}": "Wscr", "\u{1D54E}": "Wopf", "\u{1D51A}": "Wfr", "\u0175": "wcirc", "\u0174": "Wcirc", "\u{1D535}": "xfr", "\u{1D4CD}": "xscr", "\u{1D569}": "xopf", "\u{1D54F}": "Xopf", "\u{1D51B}": "Xfr", "\u{1D4B3}": "Xscr", "\u{1D536}": "yfr", "\u{1D4CE}": "yscr", "\u{1D56A}": "yopf", "\u{1D4B4}": "Yscr", "\u{1D51C}": "Yfr", "\u{1D550}": "Yopf", "\xFD": "yacute", "\xDD": "Yacute", "\u0177": "ycirc", "\u0176": "Ycirc", "\xFF": "yuml", "\u0178": "Yuml", "\u{1D4CF}": "zscr", "\u{1D537}": "zfr", "\u{1D56B}": "zopf", "\u2128": "Zfr", "\u2124": "Zopf", "\u{1D4B5}": "Zscr", "\u017A": "zacute", "\u0179": "Zacute", "\u017E": "zcaron", "\u017D": "Zcaron", "\u017C": "zdot", "\u017B": "Zdot", "\u01B5": "imped", "\xFE": "thorn", "\xDE": "THORN", "\u0149": "napos", "\u03B1": "alpha", "\u0391": "Alpha", "\u03B2": "beta", "\u0392": "Beta", "\u03B3": "gamma", "\u0393": "Gamma", "\u03B4": "delta", "\u0394": "Delta", "\u03B5": "epsi", "\u03F5": "epsiv", "\u0395": "Epsilon", "\u03DD": "gammad", "\u03DC": "Gammad", "\u03B6": "zeta", "\u0396": "Zeta", "\u03B7": "eta", "\u0397": "Eta", "\u03B8": "theta", "\u03D1": "thetav", "\u0398": "Theta", "\u03B9": "iota", "\u0399": "Iota", "\u03BA": "kappa", "\u03F0": "kappav", "\u039A": "Kappa", "\u03BB": "lambda", "\u039B": "Lambda", "\u03BC": "mu", "\xB5": "micro", "\u039C": "Mu", "\u03BD": "nu", "\u039D": "Nu", "\u03BE": "xi", "\u039E": "Xi", "\u03BF": "omicron", "\u039F": "Omicron", "\u03C0": "pi", "\u03D6": "piv", "\u03A0": "Pi", "\u03C1": "rho", "\u03F1": "rhov", "\u03A1": "Rho", "\u03C3": "sigma", "\u03A3": "Sigma", "\u03C2": "sigmaf", "\u03C4": "tau", "\u03A4": "Tau", "\u03C5": "upsi", "\u03A5": "Upsilon", "\u03D2": "Upsi", "\u03C6": "phi", "\u03D5": "phiv", "\u03A6": "Phi", "\u03C7": "chi", "\u03A7": "Chi", "\u03C8": "psi", "\u03A8": "Psi", "\u03C9": "omega", "\u03A9": "ohm", "\u0430": "acy", "\u0410": "Acy", "\u0431": "bcy", "\u0411": "Bcy", "\u0432": "vcy", "\u0412": "Vcy", "\u0433": "gcy", "\u0413": "Gcy", "\u0453": "gjcy", "\u0403": "GJcy", "\u0434": "dcy", "\u0414": "Dcy", "\u0452": "djcy", "\u0402": "DJcy", "\u0435": "iecy", "\u0415": "IEcy", "\u0451": "iocy", "\u0401": "IOcy", "\u0454": "jukcy", "\u0404": "Jukcy", "\u0436": "zhcy", "\u0416": "ZHcy", "\u0437": "zcy", "\u0417": "Zcy", "\u0455": "dscy", "\u0405": "DScy", "\u0438": "icy", "\u0418": "Icy", "\u0456": "iukcy", "\u0406": "Iukcy", "\u0457": "yicy", "\u0407": "YIcy", "\u0439": "jcy", "\u0419": "Jcy", "\u0458": "jsercy", "\u0408": "Jsercy", "\u043A": "kcy", "\u041A": "Kcy", "\u045C": "kjcy", "\u040C": "KJcy", "\u043B": "lcy", "\u041B": "Lcy", "\u0459": "ljcy", "\u0409": "LJcy", "\u043C": "mcy", "\u041C": "Mcy", "\u043D": "ncy", "\u041D": "Ncy", "\u045A": "njcy", "\u040A": "NJcy", "\u043E": "ocy", "\u041E": "Ocy", "\u043F": "pcy", "\u041F": "Pcy", "\u0440": "rcy", "\u0420": "Rcy", "\u0441": "scy", "\u0421": "Scy", "\u0442": "tcy", "\u0422": "Tcy", "\u045B": "tshcy", "\u040B": "TSHcy", "\u0443": "ucy", "\u0423": "Ucy", "\u045E": "ubrcy", "\u040E": "Ubrcy", "\u0444": "fcy", "\u0424": "Fcy", "\u0445": "khcy", "\u0425": "KHcy", "\u0446": "tscy", "\u0426": "TScy", "\u0447": "chcy", "\u0427": "CHcy", "\u045F": "dzcy", "\u040F": "DZcy", "\u0448": "shcy", "\u0428": "SHcy", "\u0449": "shchcy", "\u0429": "SHCHcy", "\u044A": "hardcy", "\u042A": "HARDcy", "\u044B": "ycy", "\u042B": "Ycy", "\u044C": "softcy", "\u042C": "SOFTcy", "\u044D": "ecy", "\u042D": "Ecy", "\u044E": "yucy", "\u042E": "YUcy", "\u044F": "yacy", "\u042F": "YAcy", "\u2135": "aleph", "\u2136": "beth", "\u2137": "gimel", "\u2138": "daleth" };
      var regexEscape = /["&'<>`]/g;
      var escapeMap = {
        '"': "&quot;",
        "&": "&amp;",
        "'": "&#x27;",
        "<": "&lt;",
        // See https://mathiasbynens.be/notes/ambiguous-ampersands: in HTML, the
        // following is not strictly necessary unless it’s part of a tag or an
        // unquoted attribute value. We’re only escaping it to support those
        // situations, and for XML support.
        ">": "&gt;",
        // In Internet Explorer ≤ 8, the backtick character can be used
        // to break out of (un)quoted attribute values or HTML comments.
        // See http://html5sec.org/#102, http://html5sec.org/#108, and
        // http://html5sec.org/#133.
        "`": "&#x60;"
      };
      var regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;
      var regexInvalidRawCodePoint = /[\0-\x08\x0B\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
      var regexDecode = /&(CounterClockwiseContourIntegral|DoubleLongLeftRightArrow|ClockwiseContourIntegral|NotNestedGreaterGreater|NotSquareSupersetEqual|DiacriticalDoubleAcute|NotRightTriangleEqual|NotSucceedsSlantEqual|NotPrecedesSlantEqual|CloseCurlyDoubleQuote|NegativeVeryThinSpace|DoubleContourIntegral|FilledVerySmallSquare|CapitalDifferentialD|OpenCurlyDoubleQuote|EmptyVerySmallSquare|NestedGreaterGreater|DoubleLongRightArrow|NotLeftTriangleEqual|NotGreaterSlantEqual|ReverseUpEquilibrium|DoubleLeftRightArrow|NotSquareSubsetEqual|NotDoubleVerticalBar|RightArrowLeftArrow|NotGreaterFullEqual|NotRightTriangleBar|SquareSupersetEqual|DownLeftRightVector|DoubleLongLeftArrow|leftrightsquigarrow|LeftArrowRightArrow|NegativeMediumSpace|blacktriangleright|RightDownVectorBar|PrecedesSlantEqual|RightDoubleBracket|SucceedsSlantEqual|NotLeftTriangleBar|RightTriangleEqual|SquareIntersection|RightDownTeeVector|ReverseEquilibrium|NegativeThickSpace|longleftrightarrow|Longleftrightarrow|LongLeftRightArrow|DownRightTeeVector|DownRightVectorBar|GreaterSlantEqual|SquareSubsetEqual|LeftDownVectorBar|LeftDoubleBracket|VerticalSeparator|rightleftharpoons|NotGreaterGreater|NotSquareSuperset|blacktriangleleft|blacktriangledown|NegativeThinSpace|LeftDownTeeVector|NotLessSlantEqual|leftrightharpoons|DoubleUpDownArrow|DoubleVerticalBar|LeftTriangleEqual|FilledSmallSquare|twoheadrightarrow|NotNestedLessLess|DownLeftTeeVector|DownLeftVectorBar|RightAngleBracket|NotTildeFullEqual|NotReverseElement|RightUpDownVector|DiacriticalTilde|NotSucceedsTilde|circlearrowright|NotPrecedesEqual|rightharpoondown|DoubleRightArrow|NotSucceedsEqual|NonBreakingSpace|NotRightTriangle|LessEqualGreater|RightUpTeeVector|LeftAngleBracket|GreaterFullEqual|DownArrowUpArrow|RightUpVectorBar|twoheadleftarrow|GreaterEqualLess|downharpoonright|RightTriangleBar|ntrianglerighteq|NotSupersetEqual|LeftUpDownVector|DiacriticalAcute|rightrightarrows|vartriangleright|UpArrowDownArrow|DiacriticalGrave|UnderParenthesis|EmptySmallSquare|LeftUpVectorBar|leftrightarrows|DownRightVector|downharpoonleft|trianglerighteq|ShortRightArrow|OverParenthesis|DoubleLeftArrow|DoubleDownArrow|NotSquareSubset|bigtriangledown|ntrianglelefteq|UpperRightArrow|curvearrowright|vartriangleleft|NotLeftTriangle|nleftrightarrow|LowerRightArrow|NotHumpDownHump|NotGreaterTilde|rightthreetimes|LeftUpTeeVector|NotGreaterEqual|straightepsilon|LeftTriangleBar|rightsquigarrow|ContourIntegral|rightleftarrows|CloseCurlyQuote|RightDownVector|LeftRightVector|nLeftrightarrow|leftharpoondown|circlearrowleft|SquareSuperset|OpenCurlyQuote|hookrightarrow|HorizontalLine|DiacriticalDot|NotLessGreater|ntriangleright|DoubleRightTee|InvisibleComma|InvisibleTimes|LowerLeftArrow|DownLeftVector|NotSubsetEqual|curvearrowleft|trianglelefteq|NotVerticalBar|TildeFullEqual|downdownarrows|NotGreaterLess|RightTeeVector|ZeroWidthSpace|looparrowright|LongRightArrow|doublebarwedge|ShortLeftArrow|ShortDownArrow|RightVectorBar|GreaterGreater|ReverseElement|rightharpoonup|LessSlantEqual|leftthreetimes|upharpoonright|rightarrowtail|LeftDownVector|Longrightarrow|NestedLessLess|UpperLeftArrow|nshortparallel|leftleftarrows|leftrightarrow|Leftrightarrow|LeftRightArrow|longrightarrow|upharpoonleft|RightArrowBar|ApplyFunction|LeftTeeVector|leftarrowtail|NotEqualTilde|varsubsetneqq|varsupsetneqq|RightTeeArrow|SucceedsEqual|SucceedsTilde|LeftVectorBar|SupersetEqual|hookleftarrow|DifferentialD|VerticalTilde|VeryThinSpace|blacktriangle|bigtriangleup|LessFullEqual|divideontimes|leftharpoonup|UpEquilibrium|ntriangleleft|RightTriangle|measuredangle|shortparallel|longleftarrow|Longleftarrow|LongLeftArrow|DoubleLeftTee|Poincareplane|PrecedesEqual|triangleright|DoubleUpArrow|RightUpVector|fallingdotseq|looparrowleft|PrecedesTilde|NotTildeEqual|NotTildeTilde|smallsetminus|Proportional|triangleleft|triangledown|UnderBracket|NotHumpEqual|exponentiale|ExponentialE|NotLessTilde|HilbertSpace|RightCeiling|blacklozenge|varsupsetneq|HumpDownHump|GreaterEqual|VerticalLine|LeftTeeArrow|NotLessEqual|DownTeeArrow|LeftTriangle|varsubsetneq|Intersection|NotCongruent|DownArrowBar|LeftUpVector|LeftArrowBar|risingdotseq|GreaterTilde|RoundImplies|SquareSubset|ShortUpArrow|NotSuperset|quaternions|precnapprox|backepsilon|preccurlyeq|OverBracket|blacksquare|MediumSpace|VerticalBar|circledcirc|circleddash|CircleMinus|CircleTimes|LessGreater|curlyeqprec|curlyeqsucc|diamondsuit|UpDownArrow|Updownarrow|RuleDelayed|Rrightarrow|updownarrow|RightVector|nRightarrow|nrightarrow|eqslantless|LeftCeiling|Equilibrium|SmallCircle|expectation|NotSucceeds|thickapprox|GreaterLess|SquareUnion|NotPrecedes|NotLessLess|straightphi|succnapprox|succcurlyeq|SubsetEqual|sqsupseteq|Proportion|Laplacetrf|ImaginaryI|supsetneqq|NotGreater|gtreqqless|NotElement|ThickSpace|TildeEqual|TildeTilde|Fouriertrf|rmoustache|EqualTilde|eqslantgtr|UnderBrace|LeftVector|UpArrowBar|nLeftarrow|nsubseteqq|subsetneqq|nsupseteqq|nleftarrow|succapprox|lessapprox|UpTeeArrow|upuparrows|curlywedge|lesseqqgtr|varepsilon|varnothing|RightFloor|complement|CirclePlus|sqsubseteq|Lleftarrow|circledast|RightArrow|Rightarrow|rightarrow|lmoustache|Bernoullis|precapprox|mapstoleft|mapstodown|longmapsto|dotsquare|downarrow|DoubleDot|nsubseteq|supsetneq|leftarrow|nsupseteq|subsetneq|ThinSpace|ngeqslant|subseteqq|HumpEqual|NotSubset|triangleq|NotCupCap|lesseqgtr|heartsuit|TripleDot|Leftarrow|Coproduct|Congruent|varpropto|complexes|gvertneqq|LeftArrow|LessTilde|supseteqq|MinusPlus|CircleDot|nleqslant|NotExists|gtreqless|nparallel|UnionPlus|LeftFloor|checkmark|CenterDot|centerdot|Mellintrf|gtrapprox|bigotimes|OverBrace|spadesuit|therefore|pitchfork|rationals|PlusMinus|Backslash|Therefore|DownBreve|backsimeq|backprime|DownArrow|nshortmid|Downarrow|lvertneqq|eqvparsl|imagline|imagpart|infintie|integers|Integral|intercal|LessLess|Uarrocir|intlarhk|sqsupset|angmsdaf|sqsubset|llcorner|vartheta|cupbrcap|lnapprox|Superset|SuchThat|succnsim|succneqq|angmsdag|biguplus|curlyvee|trpezium|Succeeds|NotTilde|bigwedge|angmsdah|angrtvbd|triminus|cwconint|fpartint|lrcorner|smeparsl|subseteq|urcorner|lurdshar|laemptyv|DDotrahd|approxeq|ldrushar|awconint|mapstoup|backcong|shortmid|triangle|geqslant|gesdotol|timesbar|circledR|circledS|setminus|multimap|naturals|scpolint|ncongdot|RightTee|boxminus|gnapprox|boxtimes|andslope|thicksim|angmsdaa|varsigma|cirfnint|rtriltri|angmsdab|rppolint|angmsdac|barwedge|drbkarow|clubsuit|thetasym|bsolhsub|capbrcup|dzigrarr|doteqdot|DotEqual|dotminus|UnderBar|NotEqual|realpart|otimesas|ulcorner|hksearow|hkswarow|parallel|PartialD|elinters|emptyset|plusacir|bbrktbrk|angmsdad|pointint|bigoplus|angmsdae|Precedes|bigsqcup|varkappa|notindot|supseteq|precneqq|precnsim|profalar|profline|profsurf|leqslant|lesdotor|raemptyv|subplus|notnivb|notnivc|subrarr|zigrarr|vzigzag|submult|subedot|Element|between|cirscir|larrbfs|larrsim|lotimes|lbrksld|lbrkslu|lozenge|ldrdhar|dbkarow|bigcirc|epsilon|simrarr|simplus|ltquest|Epsilon|luruhar|gtquest|maltese|npolint|eqcolon|npreceq|bigodot|ddagger|gtrless|bnequiv|harrcir|ddotseq|equivDD|backsim|demptyv|nsqsube|nsqsupe|Upsilon|nsubset|upsilon|minusdu|nsucceq|swarrow|nsupset|coloneq|searrow|boxplus|napprox|natural|asympeq|alefsym|congdot|nearrow|bigstar|diamond|supplus|tritime|LeftTee|nvinfin|triplus|NewLine|nvltrie|nvrtrie|nwarrow|nexists|Diamond|ruluhar|Implies|supmult|angzarr|suplarr|suphsub|questeq|because|digamma|Because|olcross|bemptyv|omicron|Omicron|rotimes|NoBreak|intprod|angrtvb|orderof|uwangle|suphsol|lesdoto|orslope|DownTee|realine|cudarrl|rdldhar|OverBar|supedot|lessdot|supdsub|topfork|succsim|rbrkslu|rbrksld|pertenk|cudarrr|isindot|planckh|lessgtr|pluscir|gesdoto|plussim|plustwo|lesssim|cularrp|rarrsim|Cayleys|notinva|notinvb|notinvc|UpArrow|Uparrow|uparrow|NotLess|dwangle|precsim|Product|curarrm|Cconint|dotplus|rarrbfs|ccupssm|Cedilla|cemptyv|notniva|quatint|frac35|frac38|frac45|frac56|frac58|frac78|tridot|xoplus|gacute|gammad|Gammad|lfisht|lfloor|bigcup|sqsupe|gbreve|Gbreve|lharul|sqsube|sqcups|Gcedil|apacir|llhard|lmidot|Lmidot|lmoust|andand|sqcaps|approx|Abreve|spades|circeq|tprime|divide|topcir|Assign|topbot|gesdot|divonx|xuplus|timesd|gesles|atilde|solbar|SOFTcy|loplus|timesb|lowast|lowbar|dlcorn|dlcrop|softcy|dollar|lparlt|thksim|lrhard|Atilde|lsaquo|smashp|bigvee|thinsp|wreath|bkarow|lsquor|lstrok|Lstrok|lthree|ltimes|ltlarr|DotDot|simdot|ltrPar|weierp|xsqcup|angmsd|sigmav|sigmaf|zeetrf|Zcaron|zcaron|mapsto|vsupne|thetav|cirmid|marker|mcomma|Zacute|vsubnE|there4|gtlPar|vsubne|bottom|gtrarr|SHCHcy|shchcy|midast|midcir|middot|minusb|minusd|gtrdot|bowtie|sfrown|mnplus|models|colone|seswar|Colone|mstpos|searhk|gtrsim|nacute|Nacute|boxbox|telrec|hairsp|Tcedil|nbumpe|scnsim|ncaron|Ncaron|ncedil|Ncedil|hamilt|Scedil|nearhk|hardcy|HARDcy|tcedil|Tcaron|commat|nequiv|nesear|tcaron|target|hearts|nexist|varrho|scedil|Scaron|scaron|hellip|Sacute|sacute|hercon|swnwar|compfn|rtimes|rthree|rsquor|rsaquo|zacute|wedgeq|homtht|barvee|barwed|Barwed|rpargt|horbar|conint|swarhk|roplus|nltrie|hslash|hstrok|Hstrok|rmoust|Conint|bprime|hybull|hyphen|iacute|Iacute|supsup|supsub|supsim|varphi|coprod|brvbar|agrave|Supset|supset|igrave|Igrave|notinE|Agrave|iiiint|iinfin|copysr|wedbar|Verbar|vangrt|becaus|incare|verbar|inodot|bullet|drcorn|intcal|drcrop|cularr|vellip|Utilde|bumpeq|cupcap|dstrok|Dstrok|CupCap|cupcup|cupdot|eacute|Eacute|supdot|iquest|easter|ecaron|Ecaron|ecolon|isinsv|utilde|itilde|Itilde|curarr|succeq|Bumpeq|cacute|ulcrop|nparsl|Cacute|nprcue|egrave|Egrave|nrarrc|nrarrw|subsup|subsub|nrtrie|jsercy|nsccue|Jsercy|kappav|kcedil|Kcedil|subsim|ulcorn|nsimeq|egsdot|veebar|kgreen|capand|elsdot|Subset|subset|curren|aacute|lacute|Lacute|emptyv|ntilde|Ntilde|lagran|lambda|Lambda|capcap|Ugrave|langle|subdot|emsp13|numero|emsp14|nvdash|nvDash|nVdash|nVDash|ugrave|ufisht|nvHarr|larrfs|nvlArr|larrhk|larrlp|larrpl|nvrArr|Udblac|nwarhk|larrtl|nwnear|oacute|Oacute|latail|lAtail|sstarf|lbrace|odblac|Odblac|lbrack|udblac|odsold|eparsl|lcaron|Lcaron|ograve|Ograve|lcedil|Lcedil|Aacute|ssmile|ssetmn|squarf|ldquor|capcup|ominus|cylcty|rharul|eqcirc|dagger|rfloor|rfisht|Dagger|daleth|equals|origof|capdot|equest|dcaron|Dcaron|rdquor|oslash|Oslash|otilde|Otilde|otimes|Otimes|urcrop|Ubreve|ubreve|Yacute|Uacute|uacute|Rcedil|rcedil|urcorn|parsim|Rcaron|Vdashl|rcaron|Tstrok|percnt|period|permil|Exists|yacute|rbrack|rbrace|phmmat|ccaron|Ccaron|planck|ccedil|plankv|tstrok|female|plusdo|plusdu|ffilig|plusmn|ffllig|Ccedil|rAtail|dfisht|bernou|ratail|Rarrtl|rarrtl|angsph|rarrpl|rarrlp|rarrhk|xwedge|xotime|forall|ForAll|Vvdash|vsupnE|preceq|bigcap|frac12|frac13|frac14|primes|rarrfs|prnsim|frac15|Square|frac16|square|lesdot|frac18|frac23|propto|prurel|rarrap|rangle|puncsp|frac25|Racute|qprime|racute|lesges|frac34|abreve|AElig|eqsim|utdot|setmn|urtri|Equal|Uring|seArr|uring|searr|dashv|Dashv|mumap|nabla|iogon|Iogon|sdote|sdotb|scsim|napid|napos|equiv|natur|Acirc|dblac|erarr|nbump|iprod|erDot|ucirc|awint|esdot|angrt|ncong|isinE|scnap|Scirc|scirc|ndash|isins|Ubrcy|nearr|neArr|isinv|nedot|ubrcy|acute|Ycirc|iukcy|Iukcy|xutri|nesim|caret|jcirc|Jcirc|caron|twixt|ddarr|sccue|exist|jmath|sbquo|ngeqq|angst|ccaps|lceil|ngsim|UpTee|delta|Delta|rtrif|nharr|nhArr|nhpar|rtrie|jukcy|Jukcy|kappa|rsquo|Kappa|nlarr|nlArr|TSHcy|rrarr|aogon|Aogon|fflig|xrarr|tshcy|ccirc|nleqq|filig|upsih|nless|dharl|nlsim|fjlig|ropar|nltri|dharr|robrk|roarr|fllig|fltns|roang|rnmid|subnE|subne|lAarr|trisb|Ccirc|acirc|ccups|blank|VDash|forkv|Vdash|langd|cedil|blk12|blk14|laquo|strns|diams|notin|vDash|larrb|blk34|block|disin|uplus|vdash|vBarv|aelig|starf|Wedge|check|xrArr|lates|lbarr|lBarr|notni|lbbrk|bcong|frasl|lbrke|frown|vrtri|vprop|vnsup|gamma|Gamma|wedge|xodot|bdquo|srarr|doteq|ldquo|boxdl|boxdL|gcirc|Gcirc|boxDl|boxDL|boxdr|boxdR|boxDr|TRADE|trade|rlhar|boxDR|vnsub|npart|vltri|rlarr|boxhd|boxhD|nprec|gescc|nrarr|nrArr|boxHd|boxHD|boxhu|boxhU|nrtri|boxHu|clubs|boxHU|times|colon|Colon|gimel|xlArr|Tilde|nsime|tilde|nsmid|nspar|THORN|thorn|xlarr|nsube|nsubE|thkap|xhArr|comma|nsucc|boxul|boxuL|nsupe|nsupE|gneqq|gnsim|boxUl|boxUL|grave|boxur|boxuR|boxUr|boxUR|lescc|angle|bepsi|boxvh|varpi|boxvH|numsp|Theta|gsime|gsiml|theta|boxVh|boxVH|boxvl|gtcir|gtdot|boxvL|boxVl|boxVL|crarr|cross|Cross|nvsim|boxvr|nwarr|nwArr|sqsup|dtdot|Uogon|lhard|lharu|dtrif|ocirc|Ocirc|lhblk|duarr|odash|sqsub|Hacek|sqcup|llarr|duhar|oelig|OElig|ofcir|boxvR|uogon|lltri|boxVr|csube|uuarr|ohbar|csupe|ctdot|olarr|olcir|harrw|oline|sqcap|omacr|Omacr|omega|Omega|boxVR|aleph|lneqq|lnsim|loang|loarr|rharu|lobrk|hcirc|operp|oplus|rhard|Hcirc|orarr|Union|order|ecirc|Ecirc|cuepr|szlig|cuesc|breve|reals|eDDot|Breve|hoarr|lopar|utrif|rdquo|Umacr|umacr|efDot|swArr|ultri|alpha|rceil|ovbar|swarr|Wcirc|wcirc|smtes|smile|bsemi|lrarr|aring|parsl|lrhar|bsime|uhblk|lrtri|cupor|Aring|uharr|uharl|slarr|rbrke|bsolb|lsime|rbbrk|RBarr|lsimg|phone|rBarr|rbarr|icirc|lsquo|Icirc|emacr|Emacr|ratio|simne|plusb|simlE|simgE|simeq|pluse|ltcir|ltdot|empty|xharr|xdtri|iexcl|Alpha|ltrie|rarrw|pound|ltrif|xcirc|bumpe|prcue|bumpE|asymp|amacr|cuvee|Sigma|sigma|iiint|udhar|iiota|ijlig|IJlig|supnE|imacr|Imacr|prime|Prime|image|prnap|eogon|Eogon|rarrc|mdash|mDDot|cuwed|imath|supne|imped|Amacr|udarr|prsim|micro|rarrb|cwint|raquo|infin|eplus|range|rangd|Ucirc|radic|minus|amalg|veeeq|rAarr|epsiv|ycirc|quest|sharp|quot|zwnj|Qscr|race|qscr|Qopf|qopf|qint|rang|Rang|Zscr|zscr|Zopf|zopf|rarr|rArr|Rarr|Pscr|pscr|prop|prod|prnE|prec|ZHcy|zhcy|prap|Zeta|zeta|Popf|popf|Zdot|plus|zdot|Yuml|yuml|phiv|YUcy|yucy|Yscr|yscr|perp|Yopf|yopf|part|para|YIcy|Ouml|rcub|yicy|YAcy|rdca|ouml|osol|Oscr|rdsh|yacy|real|oscr|xvee|andd|rect|andv|Xscr|oror|ordm|ordf|xscr|ange|aopf|Aopf|rHar|Xopf|opar|Oopf|xopf|xnis|rhov|oopf|omid|xmap|oint|apid|apos|ogon|ascr|Ascr|odot|odiv|xcup|xcap|ocir|oast|nvlt|nvle|nvgt|nvge|nvap|Wscr|wscr|auml|ntlg|ntgl|nsup|nsub|nsim|Nscr|nscr|nsce|Wopf|ring|npre|wopf|npar|Auml|Barv|bbrk|Nopf|nopf|nmid|nLtv|beta|ropf|Ropf|Beta|beth|nles|rpar|nleq|bnot|bNot|nldr|NJcy|rscr|Rscr|Vscr|vscr|rsqb|njcy|bopf|nisd|Bopf|rtri|Vopf|nGtv|ngtr|vopf|boxh|boxH|boxv|nges|ngeq|boxV|bscr|scap|Bscr|bsim|Vert|vert|bsol|bull|bump|caps|cdot|ncup|scnE|ncap|nbsp|napE|Cdot|cent|sdot|Vbar|nang|vBar|chcy|Mscr|mscr|sect|semi|CHcy|Mopf|mopf|sext|circ|cire|mldr|mlcp|cirE|comp|shcy|SHcy|vArr|varr|cong|copf|Copf|copy|COPY|malt|male|macr|lvnE|cscr|ltri|sime|ltcc|simg|Cscr|siml|csub|Uuml|lsqb|lsim|uuml|csup|Lscr|lscr|utri|smid|lpar|cups|smte|lozf|darr|Lopf|Uscr|solb|lopf|sopf|Sopf|lneq|uscr|spar|dArr|lnap|Darr|dash|Sqrt|LJcy|ljcy|lHar|dHar|Upsi|upsi|diam|lesg|djcy|DJcy|leqq|dopf|Dopf|dscr|Dscr|dscy|ldsh|ldca|squf|DScy|sscr|Sscr|dsol|lcub|late|star|Star|Uopf|Larr|lArr|larr|uopf|dtri|dzcy|sube|subE|Lang|lang|Kscr|kscr|Kopf|kopf|KJcy|kjcy|KHcy|khcy|DZcy|ecir|edot|eDot|Jscr|jscr|succ|Jopf|jopf|Edot|uHar|emsp|ensp|Iuml|iuml|eopf|isin|Iscr|iscr|Eopf|epar|sung|epsi|escr|sup1|sup2|sup3|Iota|iota|supe|supE|Iopf|iopf|IOcy|iocy|Escr|esim|Esim|imof|Uarr|QUOT|uArr|uarr|euml|IEcy|iecy|Idot|Euml|euro|excl|Hscr|hscr|Hopf|hopf|TScy|tscy|Tscr|hbar|tscr|flat|tbrk|fnof|hArr|harr|half|fopf|Fopf|tdot|gvnE|fork|trie|gtcc|fscr|Fscr|gdot|gsim|Gscr|gscr|Gopf|gopf|gneq|Gdot|tosa|gnap|Topf|topf|geqq|toea|GJcy|gjcy|tint|gesl|mid|Sfr|ggg|top|ges|gla|glE|glj|geq|gne|gEl|gel|gnE|Gcy|gcy|gap|Tfr|tfr|Tcy|tcy|Hat|Tau|Ffr|tau|Tab|hfr|Hfr|ffr|Fcy|fcy|icy|Icy|iff|ETH|eth|ifr|Ifr|Eta|eta|int|Int|Sup|sup|ucy|Ucy|Sum|sum|jcy|ENG|ufr|Ufr|eng|Jcy|jfr|els|ell|egs|Efr|efr|Jfr|uml|kcy|Kcy|Ecy|ecy|kfr|Kfr|lap|Sub|sub|lat|lcy|Lcy|leg|Dot|dot|lEg|leq|les|squ|div|die|lfr|Lfr|lgE|Dfr|dfr|Del|deg|Dcy|dcy|lne|lnE|sol|loz|smt|Cup|lrm|cup|lsh|Lsh|sim|shy|map|Map|mcy|Mcy|mfr|Mfr|mho|gfr|Gfr|sfr|cir|Chi|chi|nap|Cfr|vcy|Vcy|cfr|Scy|scy|ncy|Ncy|vee|Vee|Cap|cap|nfr|scE|sce|Nfr|nge|ngE|nGg|vfr|Vfr|ngt|bot|nGt|nis|niv|Rsh|rsh|nle|nlE|bne|Bfr|bfr|nLl|nlt|nLt|Bcy|bcy|not|Not|rlm|wfr|Wfr|npr|nsc|num|ocy|ast|Ocy|ofr|xfr|Xfr|Ofr|ogt|ohm|apE|olt|Rho|ape|rho|Rfr|rfr|ord|REG|ang|reg|orv|And|and|AMP|Rcy|amp|Afr|ycy|Ycy|yen|yfr|Yfr|rcy|par|pcy|Pcy|pfr|Pfr|phi|Phi|afr|Acy|acy|zcy|Zcy|piv|acE|acd|zfr|Zfr|pre|prE|psi|Psi|qfr|Qfr|zwj|Or|ge|Gg|gt|gg|el|oS|lt|Lt|LT|Re|lg|gl|eg|ne|Im|it|le|DD|wp|wr|nu|Nu|dd|lE|Sc|sc|pi|Pi|ee|af|ll|Ll|rx|gE|xi|pm|Xi|ic|pr|Pr|in|ni|mp|mu|ac|Mu|or|ap|Gt|GT|ii);|&(Aacute|Agrave|Atilde|Ccedil|Eacute|Egrave|Iacute|Igrave|Ntilde|Oacute|Ograve|Oslash|Otilde|Uacute|Ugrave|Yacute|aacute|agrave|atilde|brvbar|ccedil|curren|divide|eacute|egrave|frac12|frac14|frac34|iacute|igrave|iquest|middot|ntilde|oacute|ograve|oslash|otilde|plusmn|uacute|ugrave|yacute|AElig|Acirc|Aring|Ecirc|Icirc|Ocirc|THORN|Ucirc|acirc|acute|aelig|aring|cedil|ecirc|icirc|iexcl|laquo|micro|ocirc|pound|raquo|szlig|thorn|times|ucirc|Auml|COPY|Euml|Iuml|Ouml|QUOT|Uuml|auml|cent|copy|euml|iuml|macr|nbsp|ordf|ordm|ouml|para|quot|sect|sup1|sup2|sup3|uuml|yuml|AMP|ETH|REG|amp|deg|eth|not|reg|shy|uml|yen|GT|LT|gt|lt)(?!;)([=a-zA-Z0-9]?)|&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+)/g;
      var decodeMap = { "aacute": "\xE1", "Aacute": "\xC1", "abreve": "\u0103", "Abreve": "\u0102", "ac": "\u223E", "acd": "\u223F", "acE": "\u223E\u0333", "acirc": "\xE2", "Acirc": "\xC2", "acute": "\xB4", "acy": "\u0430", "Acy": "\u0410", "aelig": "\xE6", "AElig": "\xC6", "af": "\u2061", "afr": "\u{1D51E}", "Afr": "\u{1D504}", "agrave": "\xE0", "Agrave": "\xC0", "alefsym": "\u2135", "aleph": "\u2135", "alpha": "\u03B1", "Alpha": "\u0391", "amacr": "\u0101", "Amacr": "\u0100", "amalg": "\u2A3F", "amp": "&", "AMP": "&", "and": "\u2227", "And": "\u2A53", "andand": "\u2A55", "andd": "\u2A5C", "andslope": "\u2A58", "andv": "\u2A5A", "ang": "\u2220", "ange": "\u29A4", "angle": "\u2220", "angmsd": "\u2221", "angmsdaa": "\u29A8", "angmsdab": "\u29A9", "angmsdac": "\u29AA", "angmsdad": "\u29AB", "angmsdae": "\u29AC", "angmsdaf": "\u29AD", "angmsdag": "\u29AE", "angmsdah": "\u29AF", "angrt": "\u221F", "angrtvb": "\u22BE", "angrtvbd": "\u299D", "angsph": "\u2222", "angst": "\xC5", "angzarr": "\u237C", "aogon": "\u0105", "Aogon": "\u0104", "aopf": "\u{1D552}", "Aopf": "\u{1D538}", "ap": "\u2248", "apacir": "\u2A6F", "ape": "\u224A", "apE": "\u2A70", "apid": "\u224B", "apos": "'", "ApplyFunction": "\u2061", "approx": "\u2248", "approxeq": "\u224A", "aring": "\xE5", "Aring": "\xC5", "ascr": "\u{1D4B6}", "Ascr": "\u{1D49C}", "Assign": "\u2254", "ast": "*", "asymp": "\u2248", "asympeq": "\u224D", "atilde": "\xE3", "Atilde": "\xC3", "auml": "\xE4", "Auml": "\xC4", "awconint": "\u2233", "awint": "\u2A11", "backcong": "\u224C", "backepsilon": "\u03F6", "backprime": "\u2035", "backsim": "\u223D", "backsimeq": "\u22CD", "Backslash": "\u2216", "Barv": "\u2AE7", "barvee": "\u22BD", "barwed": "\u2305", "Barwed": "\u2306", "barwedge": "\u2305", "bbrk": "\u23B5", "bbrktbrk": "\u23B6", "bcong": "\u224C", "bcy": "\u0431", "Bcy": "\u0411", "bdquo": "\u201E", "becaus": "\u2235", "because": "\u2235", "Because": "\u2235", "bemptyv": "\u29B0", "bepsi": "\u03F6", "bernou": "\u212C", "Bernoullis": "\u212C", "beta": "\u03B2", "Beta": "\u0392", "beth": "\u2136", "between": "\u226C", "bfr": "\u{1D51F}", "Bfr": "\u{1D505}", "bigcap": "\u22C2", "bigcirc": "\u25EF", "bigcup": "\u22C3", "bigodot": "\u2A00", "bigoplus": "\u2A01", "bigotimes": "\u2A02", "bigsqcup": "\u2A06", "bigstar": "\u2605", "bigtriangledown": "\u25BD", "bigtriangleup": "\u25B3", "biguplus": "\u2A04", "bigvee": "\u22C1", "bigwedge": "\u22C0", "bkarow": "\u290D", "blacklozenge": "\u29EB", "blacksquare": "\u25AA", "blacktriangle": "\u25B4", "blacktriangledown": "\u25BE", "blacktriangleleft": "\u25C2", "blacktriangleright": "\u25B8", "blank": "\u2423", "blk12": "\u2592", "blk14": "\u2591", "blk34": "\u2593", "block": "\u2588", "bne": "=\u20E5", "bnequiv": "\u2261\u20E5", "bnot": "\u2310", "bNot": "\u2AED", "bopf": "\u{1D553}", "Bopf": "\u{1D539}", "bot": "\u22A5", "bottom": "\u22A5", "bowtie": "\u22C8", "boxbox": "\u29C9", "boxdl": "\u2510", "boxdL": "\u2555", "boxDl": "\u2556", "boxDL": "\u2557", "boxdr": "\u250C", "boxdR": "\u2552", "boxDr": "\u2553", "boxDR": "\u2554", "boxh": "\u2500", "boxH": "\u2550", "boxhd": "\u252C", "boxhD": "\u2565", "boxHd": "\u2564", "boxHD": "\u2566", "boxhu": "\u2534", "boxhU": "\u2568", "boxHu": "\u2567", "boxHU": "\u2569", "boxminus": "\u229F", "boxplus": "\u229E", "boxtimes": "\u22A0", "boxul": "\u2518", "boxuL": "\u255B", "boxUl": "\u255C", "boxUL": "\u255D", "boxur": "\u2514", "boxuR": "\u2558", "boxUr": "\u2559", "boxUR": "\u255A", "boxv": "\u2502", "boxV": "\u2551", "boxvh": "\u253C", "boxvH": "\u256A", "boxVh": "\u256B", "boxVH": "\u256C", "boxvl": "\u2524", "boxvL": "\u2561", "boxVl": "\u2562", "boxVL": "\u2563", "boxvr": "\u251C", "boxvR": "\u255E", "boxVr": "\u255F", "boxVR": "\u2560", "bprime": "\u2035", "breve": "\u02D8", "Breve": "\u02D8", "brvbar": "\xA6", "bscr": "\u{1D4B7}", "Bscr": "\u212C", "bsemi": "\u204F", "bsim": "\u223D", "bsime": "\u22CD", "bsol": "\\", "bsolb": "\u29C5", "bsolhsub": "\u27C8", "bull": "\u2022", "bullet": "\u2022", "bump": "\u224E", "bumpe": "\u224F", "bumpE": "\u2AAE", "bumpeq": "\u224F", "Bumpeq": "\u224E", "cacute": "\u0107", "Cacute": "\u0106", "cap": "\u2229", "Cap": "\u22D2", "capand": "\u2A44", "capbrcup": "\u2A49", "capcap": "\u2A4B", "capcup": "\u2A47", "capdot": "\u2A40", "CapitalDifferentialD": "\u2145", "caps": "\u2229\uFE00", "caret": "\u2041", "caron": "\u02C7", "Cayleys": "\u212D", "ccaps": "\u2A4D", "ccaron": "\u010D", "Ccaron": "\u010C", "ccedil": "\xE7", "Ccedil": "\xC7", "ccirc": "\u0109", "Ccirc": "\u0108", "Cconint": "\u2230", "ccups": "\u2A4C", "ccupssm": "\u2A50", "cdot": "\u010B", "Cdot": "\u010A", "cedil": "\xB8", "Cedilla": "\xB8", "cemptyv": "\u29B2", "cent": "\xA2", "centerdot": "\xB7", "CenterDot": "\xB7", "cfr": "\u{1D520}", "Cfr": "\u212D", "chcy": "\u0447", "CHcy": "\u0427", "check": "\u2713", "checkmark": "\u2713", "chi": "\u03C7", "Chi": "\u03A7", "cir": "\u25CB", "circ": "\u02C6", "circeq": "\u2257", "circlearrowleft": "\u21BA", "circlearrowright": "\u21BB", "circledast": "\u229B", "circledcirc": "\u229A", "circleddash": "\u229D", "CircleDot": "\u2299", "circledR": "\xAE", "circledS": "\u24C8", "CircleMinus": "\u2296", "CirclePlus": "\u2295", "CircleTimes": "\u2297", "cire": "\u2257", "cirE": "\u29C3", "cirfnint": "\u2A10", "cirmid": "\u2AEF", "cirscir": "\u29C2", "ClockwiseContourIntegral": "\u2232", "CloseCurlyDoubleQuote": "\u201D", "CloseCurlyQuote": "\u2019", "clubs": "\u2663", "clubsuit": "\u2663", "colon": ":", "Colon": "\u2237", "colone": "\u2254", "Colone": "\u2A74", "coloneq": "\u2254", "comma": ",", "commat": "@", "comp": "\u2201", "compfn": "\u2218", "complement": "\u2201", "complexes": "\u2102", "cong": "\u2245", "congdot": "\u2A6D", "Congruent": "\u2261", "conint": "\u222E", "Conint": "\u222F", "ContourIntegral": "\u222E", "copf": "\u{1D554}", "Copf": "\u2102", "coprod": "\u2210", "Coproduct": "\u2210", "copy": "\xA9", "COPY": "\xA9", "copysr": "\u2117", "CounterClockwiseContourIntegral": "\u2233", "crarr": "\u21B5", "cross": "\u2717", "Cross": "\u2A2F", "cscr": "\u{1D4B8}", "Cscr": "\u{1D49E}", "csub": "\u2ACF", "csube": "\u2AD1", "csup": "\u2AD0", "csupe": "\u2AD2", "ctdot": "\u22EF", "cudarrl": "\u2938", "cudarrr": "\u2935", "cuepr": "\u22DE", "cuesc": "\u22DF", "cularr": "\u21B6", "cularrp": "\u293D", "cup": "\u222A", "Cup": "\u22D3", "cupbrcap": "\u2A48", "cupcap": "\u2A46", "CupCap": "\u224D", "cupcup": "\u2A4A", "cupdot": "\u228D", "cupor": "\u2A45", "cups": "\u222A\uFE00", "curarr": "\u21B7", "curarrm": "\u293C", "curlyeqprec": "\u22DE", "curlyeqsucc": "\u22DF", "curlyvee": "\u22CE", "curlywedge": "\u22CF", "curren": "\xA4", "curvearrowleft": "\u21B6", "curvearrowright": "\u21B7", "cuvee": "\u22CE", "cuwed": "\u22CF", "cwconint": "\u2232", "cwint": "\u2231", "cylcty": "\u232D", "dagger": "\u2020", "Dagger": "\u2021", "daleth": "\u2138", "darr": "\u2193", "dArr": "\u21D3", "Darr": "\u21A1", "dash": "\u2010", "dashv": "\u22A3", "Dashv": "\u2AE4", "dbkarow": "\u290F", "dblac": "\u02DD", "dcaron": "\u010F", "Dcaron": "\u010E", "dcy": "\u0434", "Dcy": "\u0414", "dd": "\u2146", "DD": "\u2145", "ddagger": "\u2021", "ddarr": "\u21CA", "DDotrahd": "\u2911", "ddotseq": "\u2A77", "deg": "\xB0", "Del": "\u2207", "delta": "\u03B4", "Delta": "\u0394", "demptyv": "\u29B1", "dfisht": "\u297F", "dfr": "\u{1D521}", "Dfr": "\u{1D507}", "dHar": "\u2965", "dharl": "\u21C3", "dharr": "\u21C2", "DiacriticalAcute": "\xB4", "DiacriticalDot": "\u02D9", "DiacriticalDoubleAcute": "\u02DD", "DiacriticalGrave": "`", "DiacriticalTilde": "\u02DC", "diam": "\u22C4", "diamond": "\u22C4", "Diamond": "\u22C4", "diamondsuit": "\u2666", "diams": "\u2666", "die": "\xA8", "DifferentialD": "\u2146", "digamma": "\u03DD", "disin": "\u22F2", "div": "\xF7", "divide": "\xF7", "divideontimes": "\u22C7", "divonx": "\u22C7", "djcy": "\u0452", "DJcy": "\u0402", "dlcorn": "\u231E", "dlcrop": "\u230D", "dollar": "$", "dopf": "\u{1D555}", "Dopf": "\u{1D53B}", "dot": "\u02D9", "Dot": "\xA8", "DotDot": "\u20DC", "doteq": "\u2250", "doteqdot": "\u2251", "DotEqual": "\u2250", "dotminus": "\u2238", "dotplus": "\u2214", "dotsquare": "\u22A1", "doublebarwedge": "\u2306", "DoubleContourIntegral": "\u222F", "DoubleDot": "\xA8", "DoubleDownArrow": "\u21D3", "DoubleLeftArrow": "\u21D0", "DoubleLeftRightArrow": "\u21D4", "DoubleLeftTee": "\u2AE4", "DoubleLongLeftArrow": "\u27F8", "DoubleLongLeftRightArrow": "\u27FA", "DoubleLongRightArrow": "\u27F9", "DoubleRightArrow": "\u21D2", "DoubleRightTee": "\u22A8", "DoubleUpArrow": "\u21D1", "DoubleUpDownArrow": "\u21D5", "DoubleVerticalBar": "\u2225", "downarrow": "\u2193", "Downarrow": "\u21D3", "DownArrow": "\u2193", "DownArrowBar": "\u2913", "DownArrowUpArrow": "\u21F5", "DownBreve": "\u0311", "downdownarrows": "\u21CA", "downharpoonleft": "\u21C3", "downharpoonright": "\u21C2", "DownLeftRightVector": "\u2950", "DownLeftTeeVector": "\u295E", "DownLeftVector": "\u21BD", "DownLeftVectorBar": "\u2956", "DownRightTeeVector": "\u295F", "DownRightVector": "\u21C1", "DownRightVectorBar": "\u2957", "DownTee": "\u22A4", "DownTeeArrow": "\u21A7", "drbkarow": "\u2910", "drcorn": "\u231F", "drcrop": "\u230C", "dscr": "\u{1D4B9}", "Dscr": "\u{1D49F}", "dscy": "\u0455", "DScy": "\u0405", "dsol": "\u29F6", "dstrok": "\u0111", "Dstrok": "\u0110", "dtdot": "\u22F1", "dtri": "\u25BF", "dtrif": "\u25BE", "duarr": "\u21F5", "duhar": "\u296F", "dwangle": "\u29A6", "dzcy": "\u045F", "DZcy": "\u040F", "dzigrarr": "\u27FF", "eacute": "\xE9", "Eacute": "\xC9", "easter": "\u2A6E", "ecaron": "\u011B", "Ecaron": "\u011A", "ecir": "\u2256", "ecirc": "\xEA", "Ecirc": "\xCA", "ecolon": "\u2255", "ecy": "\u044D", "Ecy": "\u042D", "eDDot": "\u2A77", "edot": "\u0117", "eDot": "\u2251", "Edot": "\u0116", "ee": "\u2147", "efDot": "\u2252", "efr": "\u{1D522}", "Efr": "\u{1D508}", "eg": "\u2A9A", "egrave": "\xE8", "Egrave": "\xC8", "egs": "\u2A96", "egsdot": "\u2A98", "el": "\u2A99", "Element": "\u2208", "elinters": "\u23E7", "ell": "\u2113", "els": "\u2A95", "elsdot": "\u2A97", "emacr": "\u0113", "Emacr": "\u0112", "empty": "\u2205", "emptyset": "\u2205", "EmptySmallSquare": "\u25FB", "emptyv": "\u2205", "EmptyVerySmallSquare": "\u25AB", "emsp": "\u2003", "emsp13": "\u2004", "emsp14": "\u2005", "eng": "\u014B", "ENG": "\u014A", "ensp": "\u2002", "eogon": "\u0119", "Eogon": "\u0118", "eopf": "\u{1D556}", "Eopf": "\u{1D53C}", "epar": "\u22D5", "eparsl": "\u29E3", "eplus": "\u2A71", "epsi": "\u03B5", "epsilon": "\u03B5", "Epsilon": "\u0395", "epsiv": "\u03F5", "eqcirc": "\u2256", "eqcolon": "\u2255", "eqsim": "\u2242", "eqslantgtr": "\u2A96", "eqslantless": "\u2A95", "Equal": "\u2A75", "equals": "=", "EqualTilde": "\u2242", "equest": "\u225F", "Equilibrium": "\u21CC", "equiv": "\u2261", "equivDD": "\u2A78", "eqvparsl": "\u29E5", "erarr": "\u2971", "erDot": "\u2253", "escr": "\u212F", "Escr": "\u2130", "esdot": "\u2250", "esim": "\u2242", "Esim": "\u2A73", "eta": "\u03B7", "Eta": "\u0397", "eth": "\xF0", "ETH": "\xD0", "euml": "\xEB", "Euml": "\xCB", "euro": "\u20AC", "excl": "!", "exist": "\u2203", "Exists": "\u2203", "expectation": "\u2130", "exponentiale": "\u2147", "ExponentialE": "\u2147", "fallingdotseq": "\u2252", "fcy": "\u0444", "Fcy": "\u0424", "female": "\u2640", "ffilig": "\uFB03", "fflig": "\uFB00", "ffllig": "\uFB04", "ffr": "\u{1D523}", "Ffr": "\u{1D509}", "filig": "\uFB01", "FilledSmallSquare": "\u25FC", "FilledVerySmallSquare": "\u25AA", "fjlig": "fj", "flat": "\u266D", "fllig": "\uFB02", "fltns": "\u25B1", "fnof": "\u0192", "fopf": "\u{1D557}", "Fopf": "\u{1D53D}", "forall": "\u2200", "ForAll": "\u2200", "fork": "\u22D4", "forkv": "\u2AD9", "Fouriertrf": "\u2131", "fpartint": "\u2A0D", "frac12": "\xBD", "frac13": "\u2153", "frac14": "\xBC", "frac15": "\u2155", "frac16": "\u2159", "frac18": "\u215B", "frac23": "\u2154", "frac25": "\u2156", "frac34": "\xBE", "frac35": "\u2157", "frac38": "\u215C", "frac45": "\u2158", "frac56": "\u215A", "frac58": "\u215D", "frac78": "\u215E", "frasl": "\u2044", "frown": "\u2322", "fscr": "\u{1D4BB}", "Fscr": "\u2131", "gacute": "\u01F5", "gamma": "\u03B3", "Gamma": "\u0393", "gammad": "\u03DD", "Gammad": "\u03DC", "gap": "\u2A86", "gbreve": "\u011F", "Gbreve": "\u011E", "Gcedil": "\u0122", "gcirc": "\u011D", "Gcirc": "\u011C", "gcy": "\u0433", "Gcy": "\u0413", "gdot": "\u0121", "Gdot": "\u0120", "ge": "\u2265", "gE": "\u2267", "gel": "\u22DB", "gEl": "\u2A8C", "geq": "\u2265", "geqq": "\u2267", "geqslant": "\u2A7E", "ges": "\u2A7E", "gescc": "\u2AA9", "gesdot": "\u2A80", "gesdoto": "\u2A82", "gesdotol": "\u2A84", "gesl": "\u22DB\uFE00", "gesles": "\u2A94", "gfr": "\u{1D524}", "Gfr": "\u{1D50A}", "gg": "\u226B", "Gg": "\u22D9", "ggg": "\u22D9", "gimel": "\u2137", "gjcy": "\u0453", "GJcy": "\u0403", "gl": "\u2277", "gla": "\u2AA5", "glE": "\u2A92", "glj": "\u2AA4", "gnap": "\u2A8A", "gnapprox": "\u2A8A", "gne": "\u2A88", "gnE": "\u2269", "gneq": "\u2A88", "gneqq": "\u2269", "gnsim": "\u22E7", "gopf": "\u{1D558}", "Gopf": "\u{1D53E}", "grave": "`", "GreaterEqual": "\u2265", "GreaterEqualLess": "\u22DB", "GreaterFullEqual": "\u2267", "GreaterGreater": "\u2AA2", "GreaterLess": "\u2277", "GreaterSlantEqual": "\u2A7E", "GreaterTilde": "\u2273", "gscr": "\u210A", "Gscr": "\u{1D4A2}", "gsim": "\u2273", "gsime": "\u2A8E", "gsiml": "\u2A90", "gt": ">", "Gt": "\u226B", "GT": ">", "gtcc": "\u2AA7", "gtcir": "\u2A7A", "gtdot": "\u22D7", "gtlPar": "\u2995", "gtquest": "\u2A7C", "gtrapprox": "\u2A86", "gtrarr": "\u2978", "gtrdot": "\u22D7", "gtreqless": "\u22DB", "gtreqqless": "\u2A8C", "gtrless": "\u2277", "gtrsim": "\u2273", "gvertneqq": "\u2269\uFE00", "gvnE": "\u2269\uFE00", "Hacek": "\u02C7", "hairsp": "\u200A", "half": "\xBD", "hamilt": "\u210B", "hardcy": "\u044A", "HARDcy": "\u042A", "harr": "\u2194", "hArr": "\u21D4", "harrcir": "\u2948", "harrw": "\u21AD", "Hat": "^", "hbar": "\u210F", "hcirc": "\u0125", "Hcirc": "\u0124", "hearts": "\u2665", "heartsuit": "\u2665", "hellip": "\u2026", "hercon": "\u22B9", "hfr": "\u{1D525}", "Hfr": "\u210C", "HilbertSpace": "\u210B", "hksearow": "\u2925", "hkswarow": "\u2926", "hoarr": "\u21FF", "homtht": "\u223B", "hookleftarrow": "\u21A9", "hookrightarrow": "\u21AA", "hopf": "\u{1D559}", "Hopf": "\u210D", "horbar": "\u2015", "HorizontalLine": "\u2500", "hscr": "\u{1D4BD}", "Hscr": "\u210B", "hslash": "\u210F", "hstrok": "\u0127", "Hstrok": "\u0126", "HumpDownHump": "\u224E", "HumpEqual": "\u224F", "hybull": "\u2043", "hyphen": "\u2010", "iacute": "\xED", "Iacute": "\xCD", "ic": "\u2063", "icirc": "\xEE", "Icirc": "\xCE", "icy": "\u0438", "Icy": "\u0418", "Idot": "\u0130", "iecy": "\u0435", "IEcy": "\u0415", "iexcl": "\xA1", "iff": "\u21D4", "ifr": "\u{1D526}", "Ifr": "\u2111", "igrave": "\xEC", "Igrave": "\xCC", "ii": "\u2148", "iiiint": "\u2A0C", "iiint": "\u222D", "iinfin": "\u29DC", "iiota": "\u2129", "ijlig": "\u0133", "IJlig": "\u0132", "Im": "\u2111", "imacr": "\u012B", "Imacr": "\u012A", "image": "\u2111", "ImaginaryI": "\u2148", "imagline": "\u2110", "imagpart": "\u2111", "imath": "\u0131", "imof": "\u22B7", "imped": "\u01B5", "Implies": "\u21D2", "in": "\u2208", "incare": "\u2105", "infin": "\u221E", "infintie": "\u29DD", "inodot": "\u0131", "int": "\u222B", "Int": "\u222C", "intcal": "\u22BA", "integers": "\u2124", "Integral": "\u222B", "intercal": "\u22BA", "Intersection": "\u22C2", "intlarhk": "\u2A17", "intprod": "\u2A3C", "InvisibleComma": "\u2063", "InvisibleTimes": "\u2062", "iocy": "\u0451", "IOcy": "\u0401", "iogon": "\u012F", "Iogon": "\u012E", "iopf": "\u{1D55A}", "Iopf": "\u{1D540}", "iota": "\u03B9", "Iota": "\u0399", "iprod": "\u2A3C", "iquest": "\xBF", "iscr": "\u{1D4BE}", "Iscr": "\u2110", "isin": "\u2208", "isindot": "\u22F5", "isinE": "\u22F9", "isins": "\u22F4", "isinsv": "\u22F3", "isinv": "\u2208", "it": "\u2062", "itilde": "\u0129", "Itilde": "\u0128", "iukcy": "\u0456", "Iukcy": "\u0406", "iuml": "\xEF", "Iuml": "\xCF", "jcirc": "\u0135", "Jcirc": "\u0134", "jcy": "\u0439", "Jcy": "\u0419", "jfr": "\u{1D527}", "Jfr": "\u{1D50D}", "jmath": "\u0237", "jopf": "\u{1D55B}", "Jopf": "\u{1D541}", "jscr": "\u{1D4BF}", "Jscr": "\u{1D4A5}", "jsercy": "\u0458", "Jsercy": "\u0408", "jukcy": "\u0454", "Jukcy": "\u0404", "kappa": "\u03BA", "Kappa": "\u039A", "kappav": "\u03F0", "kcedil": "\u0137", "Kcedil": "\u0136", "kcy": "\u043A", "Kcy": "\u041A", "kfr": "\u{1D528}", "Kfr": "\u{1D50E}", "kgreen": "\u0138", "khcy": "\u0445", "KHcy": "\u0425", "kjcy": "\u045C", "KJcy": "\u040C", "kopf": "\u{1D55C}", "Kopf": "\u{1D542}", "kscr": "\u{1D4C0}", "Kscr": "\u{1D4A6}", "lAarr": "\u21DA", "lacute": "\u013A", "Lacute": "\u0139", "laemptyv": "\u29B4", "lagran": "\u2112", "lambda": "\u03BB", "Lambda": "\u039B", "lang": "\u27E8", "Lang": "\u27EA", "langd": "\u2991", "langle": "\u27E8", "lap": "\u2A85", "Laplacetrf": "\u2112", "laquo": "\xAB", "larr": "\u2190", "lArr": "\u21D0", "Larr": "\u219E", "larrb": "\u21E4", "larrbfs": "\u291F", "larrfs": "\u291D", "larrhk": "\u21A9", "larrlp": "\u21AB", "larrpl": "\u2939", "larrsim": "\u2973", "larrtl": "\u21A2", "lat": "\u2AAB", "latail": "\u2919", "lAtail": "\u291B", "late": "\u2AAD", "lates": "\u2AAD\uFE00", "lbarr": "\u290C", "lBarr": "\u290E", "lbbrk": "\u2772", "lbrace": "{", "lbrack": "[", "lbrke": "\u298B", "lbrksld": "\u298F", "lbrkslu": "\u298D", "lcaron": "\u013E", "Lcaron": "\u013D", "lcedil": "\u013C", "Lcedil": "\u013B", "lceil": "\u2308", "lcub": "{", "lcy": "\u043B", "Lcy": "\u041B", "ldca": "\u2936", "ldquo": "\u201C", "ldquor": "\u201E", "ldrdhar": "\u2967", "ldrushar": "\u294B", "ldsh": "\u21B2", "le": "\u2264", "lE": "\u2266", "LeftAngleBracket": "\u27E8", "leftarrow": "\u2190", "Leftarrow": "\u21D0", "LeftArrow": "\u2190", "LeftArrowBar": "\u21E4", "LeftArrowRightArrow": "\u21C6", "leftarrowtail": "\u21A2", "LeftCeiling": "\u2308", "LeftDoubleBracket": "\u27E6", "LeftDownTeeVector": "\u2961", "LeftDownVector": "\u21C3", "LeftDownVectorBar": "\u2959", "LeftFloor": "\u230A", "leftharpoondown": "\u21BD", "leftharpoonup": "\u21BC", "leftleftarrows": "\u21C7", "leftrightarrow": "\u2194", "Leftrightarrow": "\u21D4", "LeftRightArrow": "\u2194", "leftrightarrows": "\u21C6", "leftrightharpoons": "\u21CB", "leftrightsquigarrow": "\u21AD", "LeftRightVector": "\u294E", "LeftTee": "\u22A3", "LeftTeeArrow": "\u21A4", "LeftTeeVector": "\u295A", "leftthreetimes": "\u22CB", "LeftTriangle": "\u22B2", "LeftTriangleBar": "\u29CF", "LeftTriangleEqual": "\u22B4", "LeftUpDownVector": "\u2951", "LeftUpTeeVector": "\u2960", "LeftUpVector": "\u21BF", "LeftUpVectorBar": "\u2958", "LeftVector": "\u21BC", "LeftVectorBar": "\u2952", "leg": "\u22DA", "lEg": "\u2A8B", "leq": "\u2264", "leqq": "\u2266", "leqslant": "\u2A7D", "les": "\u2A7D", "lescc": "\u2AA8", "lesdot": "\u2A7F", "lesdoto": "\u2A81", "lesdotor": "\u2A83", "lesg": "\u22DA\uFE00", "lesges": "\u2A93", "lessapprox": "\u2A85", "lessdot": "\u22D6", "lesseqgtr": "\u22DA", "lesseqqgtr": "\u2A8B", "LessEqualGreater": "\u22DA", "LessFullEqual": "\u2266", "LessGreater": "\u2276", "lessgtr": "\u2276", "LessLess": "\u2AA1", "lesssim": "\u2272", "LessSlantEqual": "\u2A7D", "LessTilde": "\u2272", "lfisht": "\u297C", "lfloor": "\u230A", "lfr": "\u{1D529}", "Lfr": "\u{1D50F}", "lg": "\u2276", "lgE": "\u2A91", "lHar": "\u2962", "lhard": "\u21BD", "lharu": "\u21BC", "lharul": "\u296A", "lhblk": "\u2584", "ljcy": "\u0459", "LJcy": "\u0409", "ll": "\u226A", "Ll": "\u22D8", "llarr": "\u21C7", "llcorner": "\u231E", "Lleftarrow": "\u21DA", "llhard": "\u296B", "lltri": "\u25FA", "lmidot": "\u0140", "Lmidot": "\u013F", "lmoust": "\u23B0", "lmoustache": "\u23B0", "lnap": "\u2A89", "lnapprox": "\u2A89", "lne": "\u2A87", "lnE": "\u2268", "lneq": "\u2A87", "lneqq": "\u2268", "lnsim": "\u22E6", "loang": "\u27EC", "loarr": "\u21FD", "lobrk": "\u27E6", "longleftarrow": "\u27F5", "Longleftarrow": "\u27F8", "LongLeftArrow": "\u27F5", "longleftrightarrow": "\u27F7", "Longleftrightarrow": "\u27FA", "LongLeftRightArrow": "\u27F7", "longmapsto": "\u27FC", "longrightarrow": "\u27F6", "Longrightarrow": "\u27F9", "LongRightArrow": "\u27F6", "looparrowleft": "\u21AB", "looparrowright": "\u21AC", "lopar": "\u2985", "lopf": "\u{1D55D}", "Lopf": "\u{1D543}", "loplus": "\u2A2D", "lotimes": "\u2A34", "lowast": "\u2217", "lowbar": "_", "LowerLeftArrow": "\u2199", "LowerRightArrow": "\u2198", "loz": "\u25CA", "lozenge": "\u25CA", "lozf": "\u29EB", "lpar": "(", "lparlt": "\u2993", "lrarr": "\u21C6", "lrcorner": "\u231F", "lrhar": "\u21CB", "lrhard": "\u296D", "lrm": "\u200E", "lrtri": "\u22BF", "lsaquo": "\u2039", "lscr": "\u{1D4C1}", "Lscr": "\u2112", "lsh": "\u21B0", "Lsh": "\u21B0", "lsim": "\u2272", "lsime": "\u2A8D", "lsimg": "\u2A8F", "lsqb": "[", "lsquo": "\u2018", "lsquor": "\u201A", "lstrok": "\u0142", "Lstrok": "\u0141", "lt": "<", "Lt": "\u226A", "LT": "<", "ltcc": "\u2AA6", "ltcir": "\u2A79", "ltdot": "\u22D6", "lthree": "\u22CB", "ltimes": "\u22C9", "ltlarr": "\u2976", "ltquest": "\u2A7B", "ltri": "\u25C3", "ltrie": "\u22B4", "ltrif": "\u25C2", "ltrPar": "\u2996", "lurdshar": "\u294A", "luruhar": "\u2966", "lvertneqq": "\u2268\uFE00", "lvnE": "\u2268\uFE00", "macr": "\xAF", "male": "\u2642", "malt": "\u2720", "maltese": "\u2720", "map": "\u21A6", "Map": "\u2905", "mapsto": "\u21A6", "mapstodown": "\u21A7", "mapstoleft": "\u21A4", "mapstoup": "\u21A5", "marker": "\u25AE", "mcomma": "\u2A29", "mcy": "\u043C", "Mcy": "\u041C", "mdash": "\u2014", "mDDot": "\u223A", "measuredangle": "\u2221", "MediumSpace": "\u205F", "Mellintrf": "\u2133", "mfr": "\u{1D52A}", "Mfr": "\u{1D510}", "mho": "\u2127", "micro": "\xB5", "mid": "\u2223", "midast": "*", "midcir": "\u2AF0", "middot": "\xB7", "minus": "\u2212", "minusb": "\u229F", "minusd": "\u2238", "minusdu": "\u2A2A", "MinusPlus": "\u2213", "mlcp": "\u2ADB", "mldr": "\u2026", "mnplus": "\u2213", "models": "\u22A7", "mopf": "\u{1D55E}", "Mopf": "\u{1D544}", "mp": "\u2213", "mscr": "\u{1D4C2}", "Mscr": "\u2133", "mstpos": "\u223E", "mu": "\u03BC", "Mu": "\u039C", "multimap": "\u22B8", "mumap": "\u22B8", "nabla": "\u2207", "nacute": "\u0144", "Nacute": "\u0143", "nang": "\u2220\u20D2", "nap": "\u2249", "napE": "\u2A70\u0338", "napid": "\u224B\u0338", "napos": "\u0149", "napprox": "\u2249", "natur": "\u266E", "natural": "\u266E", "naturals": "\u2115", "nbsp": "\xA0", "nbump": "\u224E\u0338", "nbumpe": "\u224F\u0338", "ncap": "\u2A43", "ncaron": "\u0148", "Ncaron": "\u0147", "ncedil": "\u0146", "Ncedil": "\u0145", "ncong": "\u2247", "ncongdot": "\u2A6D\u0338", "ncup": "\u2A42", "ncy": "\u043D", "Ncy": "\u041D", "ndash": "\u2013", "ne": "\u2260", "nearhk": "\u2924", "nearr": "\u2197", "neArr": "\u21D7", "nearrow": "\u2197", "nedot": "\u2250\u0338", "NegativeMediumSpace": "\u200B", "NegativeThickSpace": "\u200B", "NegativeThinSpace": "\u200B", "NegativeVeryThinSpace": "\u200B", "nequiv": "\u2262", "nesear": "\u2928", "nesim": "\u2242\u0338", "NestedGreaterGreater": "\u226B", "NestedLessLess": "\u226A", "NewLine": "\n", "nexist": "\u2204", "nexists": "\u2204", "nfr": "\u{1D52B}", "Nfr": "\u{1D511}", "nge": "\u2271", "ngE": "\u2267\u0338", "ngeq": "\u2271", "ngeqq": "\u2267\u0338", "ngeqslant": "\u2A7E\u0338", "nges": "\u2A7E\u0338", "nGg": "\u22D9\u0338", "ngsim": "\u2275", "ngt": "\u226F", "nGt": "\u226B\u20D2", "ngtr": "\u226F", "nGtv": "\u226B\u0338", "nharr": "\u21AE", "nhArr": "\u21CE", "nhpar": "\u2AF2", "ni": "\u220B", "nis": "\u22FC", "nisd": "\u22FA", "niv": "\u220B", "njcy": "\u045A", "NJcy": "\u040A", "nlarr": "\u219A", "nlArr": "\u21CD", "nldr": "\u2025", "nle": "\u2270", "nlE": "\u2266\u0338", "nleftarrow": "\u219A", "nLeftarrow": "\u21CD", "nleftrightarrow": "\u21AE", "nLeftrightarrow": "\u21CE", "nleq": "\u2270", "nleqq": "\u2266\u0338", "nleqslant": "\u2A7D\u0338", "nles": "\u2A7D\u0338", "nless": "\u226E", "nLl": "\u22D8\u0338", "nlsim": "\u2274", "nlt": "\u226E", "nLt": "\u226A\u20D2", "nltri": "\u22EA", "nltrie": "\u22EC", "nLtv": "\u226A\u0338", "nmid": "\u2224", "NoBreak": "\u2060", "NonBreakingSpace": "\xA0", "nopf": "\u{1D55F}", "Nopf": "\u2115", "not": "\xAC", "Not": "\u2AEC", "NotCongruent": "\u2262", "NotCupCap": "\u226D", "NotDoubleVerticalBar": "\u2226", "NotElement": "\u2209", "NotEqual": "\u2260", "NotEqualTilde": "\u2242\u0338", "NotExists": "\u2204", "NotGreater": "\u226F", "NotGreaterEqual": "\u2271", "NotGreaterFullEqual": "\u2267\u0338", "NotGreaterGreater": "\u226B\u0338", "NotGreaterLess": "\u2279", "NotGreaterSlantEqual": "\u2A7E\u0338", "NotGreaterTilde": "\u2275", "NotHumpDownHump": "\u224E\u0338", "NotHumpEqual": "\u224F\u0338", "notin": "\u2209", "notindot": "\u22F5\u0338", "notinE": "\u22F9\u0338", "notinva": "\u2209", "notinvb": "\u22F7", "notinvc": "\u22F6", "NotLeftTriangle": "\u22EA", "NotLeftTriangleBar": "\u29CF\u0338", "NotLeftTriangleEqual": "\u22EC", "NotLess": "\u226E", "NotLessEqual": "\u2270", "NotLessGreater": "\u2278", "NotLessLess": "\u226A\u0338", "NotLessSlantEqual": "\u2A7D\u0338", "NotLessTilde": "\u2274", "NotNestedGreaterGreater": "\u2AA2\u0338", "NotNestedLessLess": "\u2AA1\u0338", "notni": "\u220C", "notniva": "\u220C", "notnivb": "\u22FE", "notnivc": "\u22FD", "NotPrecedes": "\u2280", "NotPrecedesEqual": "\u2AAF\u0338", "NotPrecedesSlantEqual": "\u22E0", "NotReverseElement": "\u220C", "NotRightTriangle": "\u22EB", "NotRightTriangleBar": "\u29D0\u0338", "NotRightTriangleEqual": "\u22ED", "NotSquareSubset": "\u228F\u0338", "NotSquareSubsetEqual": "\u22E2", "NotSquareSuperset": "\u2290\u0338", "NotSquareSupersetEqual": "\u22E3", "NotSubset": "\u2282\u20D2", "NotSubsetEqual": "\u2288", "NotSucceeds": "\u2281", "NotSucceedsEqual": "\u2AB0\u0338", "NotSucceedsSlantEqual": "\u22E1", "NotSucceedsTilde": "\u227F\u0338", "NotSuperset": "\u2283\u20D2", "NotSupersetEqual": "\u2289", "NotTilde": "\u2241", "NotTildeEqual": "\u2244", "NotTildeFullEqual": "\u2247", "NotTildeTilde": "\u2249", "NotVerticalBar": "\u2224", "npar": "\u2226", "nparallel": "\u2226", "nparsl": "\u2AFD\u20E5", "npart": "\u2202\u0338", "npolint": "\u2A14", "npr": "\u2280", "nprcue": "\u22E0", "npre": "\u2AAF\u0338", "nprec": "\u2280", "npreceq": "\u2AAF\u0338", "nrarr": "\u219B", "nrArr": "\u21CF", "nrarrc": "\u2933\u0338", "nrarrw": "\u219D\u0338", "nrightarrow": "\u219B", "nRightarrow": "\u21CF", "nrtri": "\u22EB", "nrtrie": "\u22ED", "nsc": "\u2281", "nsccue": "\u22E1", "nsce": "\u2AB0\u0338", "nscr": "\u{1D4C3}", "Nscr": "\u{1D4A9}", "nshortmid": "\u2224", "nshortparallel": "\u2226", "nsim": "\u2241", "nsime": "\u2244", "nsimeq": "\u2244", "nsmid": "\u2224", "nspar": "\u2226", "nsqsube": "\u22E2", "nsqsupe": "\u22E3", "nsub": "\u2284", "nsube": "\u2288", "nsubE": "\u2AC5\u0338", "nsubset": "\u2282\u20D2", "nsubseteq": "\u2288", "nsubseteqq": "\u2AC5\u0338", "nsucc": "\u2281", "nsucceq": "\u2AB0\u0338", "nsup": "\u2285", "nsupe": "\u2289", "nsupE": "\u2AC6\u0338", "nsupset": "\u2283\u20D2", "nsupseteq": "\u2289", "nsupseteqq": "\u2AC6\u0338", "ntgl": "\u2279", "ntilde": "\xF1", "Ntilde": "\xD1", "ntlg": "\u2278", "ntriangleleft": "\u22EA", "ntrianglelefteq": "\u22EC", "ntriangleright": "\u22EB", "ntrianglerighteq": "\u22ED", "nu": "\u03BD", "Nu": "\u039D", "num": "#", "numero": "\u2116", "numsp": "\u2007", "nvap": "\u224D\u20D2", "nvdash": "\u22AC", "nvDash": "\u22AD", "nVdash": "\u22AE", "nVDash": "\u22AF", "nvge": "\u2265\u20D2", "nvgt": ">\u20D2", "nvHarr": "\u2904", "nvinfin": "\u29DE", "nvlArr": "\u2902", "nvle": "\u2264\u20D2", "nvlt": "<\u20D2", "nvltrie": "\u22B4\u20D2", "nvrArr": "\u2903", "nvrtrie": "\u22B5\u20D2", "nvsim": "\u223C\u20D2", "nwarhk": "\u2923", "nwarr": "\u2196", "nwArr": "\u21D6", "nwarrow": "\u2196", "nwnear": "\u2927", "oacute": "\xF3", "Oacute": "\xD3", "oast": "\u229B", "ocir": "\u229A", "ocirc": "\xF4", "Ocirc": "\xD4", "ocy": "\u043E", "Ocy": "\u041E", "odash": "\u229D", "odblac": "\u0151", "Odblac": "\u0150", "odiv": "\u2A38", "odot": "\u2299", "odsold": "\u29BC", "oelig": "\u0153", "OElig": "\u0152", "ofcir": "\u29BF", "ofr": "\u{1D52C}", "Ofr": "\u{1D512}", "ogon": "\u02DB", "ograve": "\xF2", "Ograve": "\xD2", "ogt": "\u29C1", "ohbar": "\u29B5", "ohm": "\u03A9", "oint": "\u222E", "olarr": "\u21BA", "olcir": "\u29BE", "olcross": "\u29BB", "oline": "\u203E", "olt": "\u29C0", "omacr": "\u014D", "Omacr": "\u014C", "omega": "\u03C9", "Omega": "\u03A9", "omicron": "\u03BF", "Omicron": "\u039F", "omid": "\u29B6", "ominus": "\u2296", "oopf": "\u{1D560}", "Oopf": "\u{1D546}", "opar": "\u29B7", "OpenCurlyDoubleQuote": "\u201C", "OpenCurlyQuote": "\u2018", "operp": "\u29B9", "oplus": "\u2295", "or": "\u2228", "Or": "\u2A54", "orarr": "\u21BB", "ord": "\u2A5D", "order": "\u2134", "orderof": "\u2134", "ordf": "\xAA", "ordm": "\xBA", "origof": "\u22B6", "oror": "\u2A56", "orslope": "\u2A57", "orv": "\u2A5B", "oS": "\u24C8", "oscr": "\u2134", "Oscr": "\u{1D4AA}", "oslash": "\xF8", "Oslash": "\xD8", "osol": "\u2298", "otilde": "\xF5", "Otilde": "\xD5", "otimes": "\u2297", "Otimes": "\u2A37", "otimesas": "\u2A36", "ouml": "\xF6", "Ouml": "\xD6", "ovbar": "\u233D", "OverBar": "\u203E", "OverBrace": "\u23DE", "OverBracket": "\u23B4", "OverParenthesis": "\u23DC", "par": "\u2225", "para": "\xB6", "parallel": "\u2225", "parsim": "\u2AF3", "parsl": "\u2AFD", "part": "\u2202", "PartialD": "\u2202", "pcy": "\u043F", "Pcy": "\u041F", "percnt": "%", "period": ".", "permil": "\u2030", "perp": "\u22A5", "pertenk": "\u2031", "pfr": "\u{1D52D}", "Pfr": "\u{1D513}", "phi": "\u03C6", "Phi": "\u03A6", "phiv": "\u03D5", "phmmat": "\u2133", "phone": "\u260E", "pi": "\u03C0", "Pi": "\u03A0", "pitchfork": "\u22D4", "piv": "\u03D6", "planck": "\u210F", "planckh": "\u210E", "plankv": "\u210F", "plus": "+", "plusacir": "\u2A23", "plusb": "\u229E", "pluscir": "\u2A22", "plusdo": "\u2214", "plusdu": "\u2A25", "pluse": "\u2A72", "PlusMinus": "\xB1", "plusmn": "\xB1", "plussim": "\u2A26", "plustwo": "\u2A27", "pm": "\xB1", "Poincareplane": "\u210C", "pointint": "\u2A15", "popf": "\u{1D561}", "Popf": "\u2119", "pound": "\xA3", "pr": "\u227A", "Pr": "\u2ABB", "prap": "\u2AB7", "prcue": "\u227C", "pre": "\u2AAF", "prE": "\u2AB3", "prec": "\u227A", "precapprox": "\u2AB7", "preccurlyeq": "\u227C", "Precedes": "\u227A", "PrecedesEqual": "\u2AAF", "PrecedesSlantEqual": "\u227C", "PrecedesTilde": "\u227E", "preceq": "\u2AAF", "precnapprox": "\u2AB9", "precneqq": "\u2AB5", "precnsim": "\u22E8", "precsim": "\u227E", "prime": "\u2032", "Prime": "\u2033", "primes": "\u2119", "prnap": "\u2AB9", "prnE": "\u2AB5", "prnsim": "\u22E8", "prod": "\u220F", "Product": "\u220F", "profalar": "\u232E", "profline": "\u2312", "profsurf": "\u2313", "prop": "\u221D", "Proportion": "\u2237", "Proportional": "\u221D", "propto": "\u221D", "prsim": "\u227E", "prurel": "\u22B0", "pscr": "\u{1D4C5}", "Pscr": "\u{1D4AB}", "psi": "\u03C8", "Psi": "\u03A8", "puncsp": "\u2008", "qfr": "\u{1D52E}", "Qfr": "\u{1D514}", "qint": "\u2A0C", "qopf": "\u{1D562}", "Qopf": "\u211A", "qprime": "\u2057", "qscr": "\u{1D4C6}", "Qscr": "\u{1D4AC}", "quaternions": "\u210D", "quatint": "\u2A16", "quest": "?", "questeq": "\u225F", "quot": '"', "QUOT": '"', "rAarr": "\u21DB", "race": "\u223D\u0331", "racute": "\u0155", "Racute": "\u0154", "radic": "\u221A", "raemptyv": "\u29B3", "rang": "\u27E9", "Rang": "\u27EB", "rangd": "\u2992", "range": "\u29A5", "rangle": "\u27E9", "raquo": "\xBB", "rarr": "\u2192", "rArr": "\u21D2", "Rarr": "\u21A0", "rarrap": "\u2975", "rarrb": "\u21E5", "rarrbfs": "\u2920", "rarrc": "\u2933", "rarrfs": "\u291E", "rarrhk": "\u21AA", "rarrlp": "\u21AC", "rarrpl": "\u2945", "rarrsim": "\u2974", "rarrtl": "\u21A3", "Rarrtl": "\u2916", "rarrw": "\u219D", "ratail": "\u291A", "rAtail": "\u291C", "ratio": "\u2236", "rationals": "\u211A", "rbarr": "\u290D", "rBarr": "\u290F", "RBarr": "\u2910", "rbbrk": "\u2773", "rbrace": "}", "rbrack": "]", "rbrke": "\u298C", "rbrksld": "\u298E", "rbrkslu": "\u2990", "rcaron": "\u0159", "Rcaron": "\u0158", "rcedil": "\u0157", "Rcedil": "\u0156", "rceil": "\u2309", "rcub": "}", "rcy": "\u0440", "Rcy": "\u0420", "rdca": "\u2937", "rdldhar": "\u2969", "rdquo": "\u201D", "rdquor": "\u201D", "rdsh": "\u21B3", "Re": "\u211C", "real": "\u211C", "realine": "\u211B", "realpart": "\u211C", "reals": "\u211D", "rect": "\u25AD", "reg": "\xAE", "REG": "\xAE", "ReverseElement": "\u220B", "ReverseEquilibrium": "\u21CB", "ReverseUpEquilibrium": "\u296F", "rfisht": "\u297D", "rfloor": "\u230B", "rfr": "\u{1D52F}", "Rfr": "\u211C", "rHar": "\u2964", "rhard": "\u21C1", "rharu": "\u21C0", "rharul": "\u296C", "rho": "\u03C1", "Rho": "\u03A1", "rhov": "\u03F1", "RightAngleBracket": "\u27E9", "rightarrow": "\u2192", "Rightarrow": "\u21D2", "RightArrow": "\u2192", "RightArrowBar": "\u21E5", "RightArrowLeftArrow": "\u21C4", "rightarrowtail": "\u21A3", "RightCeiling": "\u2309", "RightDoubleBracket": "\u27E7", "RightDownTeeVector": "\u295D", "RightDownVector": "\u21C2", "RightDownVectorBar": "\u2955", "RightFloor": "\u230B", "rightharpoondown": "\u21C1", "rightharpoonup": "\u21C0", "rightleftarrows": "\u21C4", "rightleftharpoons": "\u21CC", "rightrightarrows": "\u21C9", "rightsquigarrow": "\u219D", "RightTee": "\u22A2", "RightTeeArrow": "\u21A6", "RightTeeVector": "\u295B", "rightthreetimes": "\u22CC", "RightTriangle": "\u22B3", "RightTriangleBar": "\u29D0", "RightTriangleEqual": "\u22B5", "RightUpDownVector": "\u294F", "RightUpTeeVector": "\u295C", "RightUpVector": "\u21BE", "RightUpVectorBar": "\u2954", "RightVector": "\u21C0", "RightVectorBar": "\u2953", "ring": "\u02DA", "risingdotseq": "\u2253", "rlarr": "\u21C4", "rlhar": "\u21CC", "rlm": "\u200F", "rmoust": "\u23B1", "rmoustache": "\u23B1", "rnmid": "\u2AEE", "roang": "\u27ED", "roarr": "\u21FE", "robrk": "\u27E7", "ropar": "\u2986", "ropf": "\u{1D563}", "Ropf": "\u211D", "roplus": "\u2A2E", "rotimes": "\u2A35", "RoundImplies": "\u2970", "rpar": ")", "rpargt": "\u2994", "rppolint": "\u2A12", "rrarr": "\u21C9", "Rrightarrow": "\u21DB", "rsaquo": "\u203A", "rscr": "\u{1D4C7}", "Rscr": "\u211B", "rsh": "\u21B1", "Rsh": "\u21B1", "rsqb": "]", "rsquo": "\u2019", "rsquor": "\u2019", "rthree": "\u22CC", "rtimes": "\u22CA", "rtri": "\u25B9", "rtrie": "\u22B5", "rtrif": "\u25B8", "rtriltri": "\u29CE", "RuleDelayed": "\u29F4", "ruluhar": "\u2968", "rx": "\u211E", "sacute": "\u015B", "Sacute": "\u015A", "sbquo": "\u201A", "sc": "\u227B", "Sc": "\u2ABC", "scap": "\u2AB8", "scaron": "\u0161", "Scaron": "\u0160", "sccue": "\u227D", "sce": "\u2AB0", "scE": "\u2AB4", "scedil": "\u015F", "Scedil": "\u015E", "scirc": "\u015D", "Scirc": "\u015C", "scnap": "\u2ABA", "scnE": "\u2AB6", "scnsim": "\u22E9", "scpolint": "\u2A13", "scsim": "\u227F", "scy": "\u0441", "Scy": "\u0421", "sdot": "\u22C5", "sdotb": "\u22A1", "sdote": "\u2A66", "searhk": "\u2925", "searr": "\u2198", "seArr": "\u21D8", "searrow": "\u2198", "sect": "\xA7", "semi": ";", "seswar": "\u2929", "setminus": "\u2216", "setmn": "\u2216", "sext": "\u2736", "sfr": "\u{1D530}", "Sfr": "\u{1D516}", "sfrown": "\u2322", "sharp": "\u266F", "shchcy": "\u0449", "SHCHcy": "\u0429", "shcy": "\u0448", "SHcy": "\u0428", "ShortDownArrow": "\u2193", "ShortLeftArrow": "\u2190", "shortmid": "\u2223", "shortparallel": "\u2225", "ShortRightArrow": "\u2192", "ShortUpArrow": "\u2191", "shy": "\xAD", "sigma": "\u03C3", "Sigma": "\u03A3", "sigmaf": "\u03C2", "sigmav": "\u03C2", "sim": "\u223C", "simdot": "\u2A6A", "sime": "\u2243", "simeq": "\u2243", "simg": "\u2A9E", "simgE": "\u2AA0", "siml": "\u2A9D", "simlE": "\u2A9F", "simne": "\u2246", "simplus": "\u2A24", "simrarr": "\u2972", "slarr": "\u2190", "SmallCircle": "\u2218", "smallsetminus": "\u2216", "smashp": "\u2A33", "smeparsl": "\u29E4", "smid": "\u2223", "smile": "\u2323", "smt": "\u2AAA", "smte": "\u2AAC", "smtes": "\u2AAC\uFE00", "softcy": "\u044C", "SOFTcy": "\u042C", "sol": "/", "solb": "\u29C4", "solbar": "\u233F", "sopf": "\u{1D564}", "Sopf": "\u{1D54A}", "spades": "\u2660", "spadesuit": "\u2660", "spar": "\u2225", "sqcap": "\u2293", "sqcaps": "\u2293\uFE00", "sqcup": "\u2294", "sqcups": "\u2294\uFE00", "Sqrt": "\u221A", "sqsub": "\u228F", "sqsube": "\u2291", "sqsubset": "\u228F", "sqsubseteq": "\u2291", "sqsup": "\u2290", "sqsupe": "\u2292", "sqsupset": "\u2290", "sqsupseteq": "\u2292", "squ": "\u25A1", "square": "\u25A1", "Square": "\u25A1", "SquareIntersection": "\u2293", "SquareSubset": "\u228F", "SquareSubsetEqual": "\u2291", "SquareSuperset": "\u2290", "SquareSupersetEqual": "\u2292", "SquareUnion": "\u2294", "squarf": "\u25AA", "squf": "\u25AA", "srarr": "\u2192", "sscr": "\u{1D4C8}", "Sscr": "\u{1D4AE}", "ssetmn": "\u2216", "ssmile": "\u2323", "sstarf": "\u22C6", "star": "\u2606", "Star": "\u22C6", "starf": "\u2605", "straightepsilon": "\u03F5", "straightphi": "\u03D5", "strns": "\xAF", "sub": "\u2282", "Sub": "\u22D0", "subdot": "\u2ABD", "sube": "\u2286", "subE": "\u2AC5", "subedot": "\u2AC3", "submult": "\u2AC1", "subne": "\u228A", "subnE": "\u2ACB", "subplus": "\u2ABF", "subrarr": "\u2979", "subset": "\u2282", "Subset": "\u22D0", "subseteq": "\u2286", "subseteqq": "\u2AC5", "SubsetEqual": "\u2286", "subsetneq": "\u228A", "subsetneqq": "\u2ACB", "subsim": "\u2AC7", "subsub": "\u2AD5", "subsup": "\u2AD3", "succ": "\u227B", "succapprox": "\u2AB8", "succcurlyeq": "\u227D", "Succeeds": "\u227B", "SucceedsEqual": "\u2AB0", "SucceedsSlantEqual": "\u227D", "SucceedsTilde": "\u227F", "succeq": "\u2AB0", "succnapprox": "\u2ABA", "succneqq": "\u2AB6", "succnsim": "\u22E9", "succsim": "\u227F", "SuchThat": "\u220B", "sum": "\u2211", "Sum": "\u2211", "sung": "\u266A", "sup": "\u2283", "Sup": "\u22D1", "sup1": "\xB9", "sup2": "\xB2", "sup3": "\xB3", "supdot": "\u2ABE", "supdsub": "\u2AD8", "supe": "\u2287", "supE": "\u2AC6", "supedot": "\u2AC4", "Superset": "\u2283", "SupersetEqual": "\u2287", "suphsol": "\u27C9", "suphsub": "\u2AD7", "suplarr": "\u297B", "supmult": "\u2AC2", "supne": "\u228B", "supnE": "\u2ACC", "supplus": "\u2AC0", "supset": "\u2283", "Supset": "\u22D1", "supseteq": "\u2287", "supseteqq": "\u2AC6", "supsetneq": "\u228B", "supsetneqq": "\u2ACC", "supsim": "\u2AC8", "supsub": "\u2AD4", "supsup": "\u2AD6", "swarhk": "\u2926", "swarr": "\u2199", "swArr": "\u21D9", "swarrow": "\u2199", "swnwar": "\u292A", "szlig": "\xDF", "Tab": "	", "target": "\u2316", "tau": "\u03C4", "Tau": "\u03A4", "tbrk": "\u23B4", "tcaron": "\u0165", "Tcaron": "\u0164", "tcedil": "\u0163", "Tcedil": "\u0162", "tcy": "\u0442", "Tcy": "\u0422", "tdot": "\u20DB", "telrec": "\u2315", "tfr": "\u{1D531}", "Tfr": "\u{1D517}", "there4": "\u2234", "therefore": "\u2234", "Therefore": "\u2234", "theta": "\u03B8", "Theta": "\u0398", "thetasym": "\u03D1", "thetav": "\u03D1", "thickapprox": "\u2248", "thicksim": "\u223C", "ThickSpace": "\u205F\u200A", "thinsp": "\u2009", "ThinSpace": "\u2009", "thkap": "\u2248", "thksim": "\u223C", "thorn": "\xFE", "THORN": "\xDE", "tilde": "\u02DC", "Tilde": "\u223C", "TildeEqual": "\u2243", "TildeFullEqual": "\u2245", "TildeTilde": "\u2248", "times": "\xD7", "timesb": "\u22A0", "timesbar": "\u2A31", "timesd": "\u2A30", "tint": "\u222D", "toea": "\u2928", "top": "\u22A4", "topbot": "\u2336", "topcir": "\u2AF1", "topf": "\u{1D565}", "Topf": "\u{1D54B}", "topfork": "\u2ADA", "tosa": "\u2929", "tprime": "\u2034", "trade": "\u2122", "TRADE": "\u2122", "triangle": "\u25B5", "triangledown": "\u25BF", "triangleleft": "\u25C3", "trianglelefteq": "\u22B4", "triangleq": "\u225C", "triangleright": "\u25B9", "trianglerighteq": "\u22B5", "tridot": "\u25EC", "trie": "\u225C", "triminus": "\u2A3A", "TripleDot": "\u20DB", "triplus": "\u2A39", "trisb": "\u29CD", "tritime": "\u2A3B", "trpezium": "\u23E2", "tscr": "\u{1D4C9}", "Tscr": "\u{1D4AF}", "tscy": "\u0446", "TScy": "\u0426", "tshcy": "\u045B", "TSHcy": "\u040B", "tstrok": "\u0167", "Tstrok": "\u0166", "twixt": "\u226C", "twoheadleftarrow": "\u219E", "twoheadrightarrow": "\u21A0", "uacute": "\xFA", "Uacute": "\xDA", "uarr": "\u2191", "uArr": "\u21D1", "Uarr": "\u219F", "Uarrocir": "\u2949", "ubrcy": "\u045E", "Ubrcy": "\u040E", "ubreve": "\u016D", "Ubreve": "\u016C", "ucirc": "\xFB", "Ucirc": "\xDB", "ucy": "\u0443", "Ucy": "\u0423", "udarr": "\u21C5", "udblac": "\u0171", "Udblac": "\u0170", "udhar": "\u296E", "ufisht": "\u297E", "ufr": "\u{1D532}", "Ufr": "\u{1D518}", "ugrave": "\xF9", "Ugrave": "\xD9", "uHar": "\u2963", "uharl": "\u21BF", "uharr": "\u21BE", "uhblk": "\u2580", "ulcorn": "\u231C", "ulcorner": "\u231C", "ulcrop": "\u230F", "ultri": "\u25F8", "umacr": "\u016B", "Umacr": "\u016A", "uml": "\xA8", "UnderBar": "_", "UnderBrace": "\u23DF", "UnderBracket": "\u23B5", "UnderParenthesis": "\u23DD", "Union": "\u22C3", "UnionPlus": "\u228E", "uogon": "\u0173", "Uogon": "\u0172", "uopf": "\u{1D566}", "Uopf": "\u{1D54C}", "uparrow": "\u2191", "Uparrow": "\u21D1", "UpArrow": "\u2191", "UpArrowBar": "\u2912", "UpArrowDownArrow": "\u21C5", "updownarrow": "\u2195", "Updownarrow": "\u21D5", "UpDownArrow": "\u2195", "UpEquilibrium": "\u296E", "upharpoonleft": "\u21BF", "upharpoonright": "\u21BE", "uplus": "\u228E", "UpperLeftArrow": "\u2196", "UpperRightArrow": "\u2197", "upsi": "\u03C5", "Upsi": "\u03D2", "upsih": "\u03D2", "upsilon": "\u03C5", "Upsilon": "\u03A5", "UpTee": "\u22A5", "UpTeeArrow": "\u21A5", "upuparrows": "\u21C8", "urcorn": "\u231D", "urcorner": "\u231D", "urcrop": "\u230E", "uring": "\u016F", "Uring": "\u016E", "urtri": "\u25F9", "uscr": "\u{1D4CA}", "Uscr": "\u{1D4B0}", "utdot": "\u22F0", "utilde": "\u0169", "Utilde": "\u0168", "utri": "\u25B5", "utrif": "\u25B4", "uuarr": "\u21C8", "uuml": "\xFC", "Uuml": "\xDC", "uwangle": "\u29A7", "vangrt": "\u299C", "varepsilon": "\u03F5", "varkappa": "\u03F0", "varnothing": "\u2205", "varphi": "\u03D5", "varpi": "\u03D6", "varpropto": "\u221D", "varr": "\u2195", "vArr": "\u21D5", "varrho": "\u03F1", "varsigma": "\u03C2", "varsubsetneq": "\u228A\uFE00", "varsubsetneqq": "\u2ACB\uFE00", "varsupsetneq": "\u228B\uFE00", "varsupsetneqq": "\u2ACC\uFE00", "vartheta": "\u03D1", "vartriangleleft": "\u22B2", "vartriangleright": "\u22B3", "vBar": "\u2AE8", "Vbar": "\u2AEB", "vBarv": "\u2AE9", "vcy": "\u0432", "Vcy": "\u0412", "vdash": "\u22A2", "vDash": "\u22A8", "Vdash": "\u22A9", "VDash": "\u22AB", "Vdashl": "\u2AE6", "vee": "\u2228", "Vee": "\u22C1", "veebar": "\u22BB", "veeeq": "\u225A", "vellip": "\u22EE", "verbar": "|", "Verbar": "\u2016", "vert": "|", "Vert": "\u2016", "VerticalBar": "\u2223", "VerticalLine": "|", "VerticalSeparator": "\u2758", "VerticalTilde": "\u2240", "VeryThinSpace": "\u200A", "vfr": "\u{1D533}", "Vfr": "\u{1D519}", "vltri": "\u22B2", "vnsub": "\u2282\u20D2", "vnsup": "\u2283\u20D2", "vopf": "\u{1D567}", "Vopf": "\u{1D54D}", "vprop": "\u221D", "vrtri": "\u22B3", "vscr": "\u{1D4CB}", "Vscr": "\u{1D4B1}", "vsubne": "\u228A\uFE00", "vsubnE": "\u2ACB\uFE00", "vsupne": "\u228B\uFE00", "vsupnE": "\u2ACC\uFE00", "Vvdash": "\u22AA", "vzigzag": "\u299A", "wcirc": "\u0175", "Wcirc": "\u0174", "wedbar": "\u2A5F", "wedge": "\u2227", "Wedge": "\u22C0", "wedgeq": "\u2259", "weierp": "\u2118", "wfr": "\u{1D534}", "Wfr": "\u{1D51A}", "wopf": "\u{1D568}", "Wopf": "\u{1D54E}", "wp": "\u2118", "wr": "\u2240", "wreath": "\u2240", "wscr": "\u{1D4CC}", "Wscr": "\u{1D4B2}", "xcap": "\u22C2", "xcirc": "\u25EF", "xcup": "\u22C3", "xdtri": "\u25BD", "xfr": "\u{1D535}", "Xfr": "\u{1D51B}", "xharr": "\u27F7", "xhArr": "\u27FA", "xi": "\u03BE", "Xi": "\u039E", "xlarr": "\u27F5", "xlArr": "\u27F8", "xmap": "\u27FC", "xnis": "\u22FB", "xodot": "\u2A00", "xopf": "\u{1D569}", "Xopf": "\u{1D54F}", "xoplus": "\u2A01", "xotime": "\u2A02", "xrarr": "\u27F6", "xrArr": "\u27F9", "xscr": "\u{1D4CD}", "Xscr": "\u{1D4B3}", "xsqcup": "\u2A06", "xuplus": "\u2A04", "xutri": "\u25B3", "xvee": "\u22C1", "xwedge": "\u22C0", "yacute": "\xFD", "Yacute": "\xDD", "yacy": "\u044F", "YAcy": "\u042F", "ycirc": "\u0177", "Ycirc": "\u0176", "ycy": "\u044B", "Ycy": "\u042B", "yen": "\xA5", "yfr": "\u{1D536}", "Yfr": "\u{1D51C}", "yicy": "\u0457", "YIcy": "\u0407", "yopf": "\u{1D56A}", "Yopf": "\u{1D550}", "yscr": "\u{1D4CE}", "Yscr": "\u{1D4B4}", "yucy": "\u044E", "YUcy": "\u042E", "yuml": "\xFF", "Yuml": "\u0178", "zacute": "\u017A", "Zacute": "\u0179", "zcaron": "\u017E", "Zcaron": "\u017D", "zcy": "\u0437", "Zcy": "\u0417", "zdot": "\u017C", "Zdot": "\u017B", "zeetrf": "\u2128", "ZeroWidthSpace": "\u200B", "zeta": "\u03B6", "Zeta": "\u0396", "zfr": "\u{1D537}", "Zfr": "\u2128", "zhcy": "\u0436", "ZHcy": "\u0416", "zigrarr": "\u21DD", "zopf": "\u{1D56B}", "Zopf": "\u2124", "zscr": "\u{1D4CF}", "Zscr": "\u{1D4B5}", "zwj": "\u200D", "zwnj": "\u200C" };
      var decodeMapLegacy = { "aacute": "\xE1", "Aacute": "\xC1", "acirc": "\xE2", "Acirc": "\xC2", "acute": "\xB4", "aelig": "\xE6", "AElig": "\xC6", "agrave": "\xE0", "Agrave": "\xC0", "amp": "&", "AMP": "&", "aring": "\xE5", "Aring": "\xC5", "atilde": "\xE3", "Atilde": "\xC3", "auml": "\xE4", "Auml": "\xC4", "brvbar": "\xA6", "ccedil": "\xE7", "Ccedil": "\xC7", "cedil": "\xB8", "cent": "\xA2", "copy": "\xA9", "COPY": "\xA9", "curren": "\xA4", "deg": "\xB0", "divide": "\xF7", "eacute": "\xE9", "Eacute": "\xC9", "ecirc": "\xEA", "Ecirc": "\xCA", "egrave": "\xE8", "Egrave": "\xC8", "eth": "\xF0", "ETH": "\xD0", "euml": "\xEB", "Euml": "\xCB", "frac12": "\xBD", "frac14": "\xBC", "frac34": "\xBE", "gt": ">", "GT": ">", "iacute": "\xED", "Iacute": "\xCD", "icirc": "\xEE", "Icirc": "\xCE", "iexcl": "\xA1", "igrave": "\xEC", "Igrave": "\xCC", "iquest": "\xBF", "iuml": "\xEF", "Iuml": "\xCF", "laquo": "\xAB", "lt": "<", "LT": "<", "macr": "\xAF", "micro": "\xB5", "middot": "\xB7", "nbsp": "\xA0", "not": "\xAC", "ntilde": "\xF1", "Ntilde": "\xD1", "oacute": "\xF3", "Oacute": "\xD3", "ocirc": "\xF4", "Ocirc": "\xD4", "ograve": "\xF2", "Ograve": "\xD2", "ordf": "\xAA", "ordm": "\xBA", "oslash": "\xF8", "Oslash": "\xD8", "otilde": "\xF5", "Otilde": "\xD5", "ouml": "\xF6", "Ouml": "\xD6", "para": "\xB6", "plusmn": "\xB1", "pound": "\xA3", "quot": '"', "QUOT": '"', "raquo": "\xBB", "reg": "\xAE", "REG": "\xAE", "sect": "\xA7", "shy": "\xAD", "sup1": "\xB9", "sup2": "\xB2", "sup3": "\xB3", "szlig": "\xDF", "thorn": "\xFE", "THORN": "\xDE", "times": "\xD7", "uacute": "\xFA", "Uacute": "\xDA", "ucirc": "\xFB", "Ucirc": "\xDB", "ugrave": "\xF9", "Ugrave": "\xD9", "uml": "\xA8", "uuml": "\xFC", "Uuml": "\xDC", "yacute": "\xFD", "Yacute": "\xDD", "yen": "\xA5", "yuml": "\xFF" };
      var decodeMapNumeric = { "0": "\uFFFD", "128": "\u20AC", "130": "\u201A", "131": "\u0192", "132": "\u201E", "133": "\u2026", "134": "\u2020", "135": "\u2021", "136": "\u02C6", "137": "\u2030", "138": "\u0160", "139": "\u2039", "140": "\u0152", "142": "\u017D", "145": "\u2018", "146": "\u2019", "147": "\u201C", "148": "\u201D", "149": "\u2022", "150": "\u2013", "151": "\u2014", "152": "\u02DC", "153": "\u2122", "154": "\u0161", "155": "\u203A", "156": "\u0153", "158": "\u017E", "159": "\u0178" };
      var invalidReferenceCodePoints = [1, 2, 3, 4, 5, 6, 7, 8, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 64976, 64977, 64978, 64979, 64980, 64981, 64982, 64983, 64984, 64985, 64986, 64987, 64988, 64989, 64990, 64991, 64992, 64993, 64994, 64995, 64996, 64997, 64998, 64999, 65e3, 65001, 65002, 65003, 65004, 65005, 65006, 65007, 65534, 65535, 131070, 131071, 196606, 196607, 262142, 262143, 327678, 327679, 393214, 393215, 458750, 458751, 524286, 524287, 589822, 589823, 655358, 655359, 720894, 720895, 786430, 786431, 851966, 851967, 917502, 917503, 983038, 983039, 1048574, 1048575, 1114110, 1114111];
      var stringFromCharCode = String.fromCharCode;
      var object = {};
      var hasOwnProperty = object.hasOwnProperty;
      var has = function(object2, propertyName) {
        return hasOwnProperty.call(object2, propertyName);
      };
      var contains = function(array, value) {
        var index = -1;
        var length = array.length;
        while (++index < length) {
          if (array[index] == value) {
            return true;
          }
        }
        return false;
      };
      var merge = function(options, defaults) {
        if (!options) {
          return defaults;
        }
        var result = {};
        var key2;
        for (key2 in defaults) {
          result[key2] = has(options, key2) ? options[key2] : defaults[key2];
        }
        return result;
      };
      var codePointToSymbol = function(codePoint, strict) {
        var output = "";
        if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
          if (strict) {
            parseError("character reference outside the permissible Unicode range");
          }
          return "\uFFFD";
        }
        if (has(decodeMapNumeric, codePoint)) {
          if (strict) {
            parseError("disallowed character reference");
          }
          return decodeMapNumeric[codePoint];
        }
        if (strict && contains(invalidReferenceCodePoints, codePoint)) {
          parseError("disallowed character reference");
        }
        if (codePoint > 65535) {
          codePoint -= 65536;
          output += stringFromCharCode(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        output += stringFromCharCode(codePoint);
        return output;
      };
      var hexEscape = function(codePoint) {
        return "&#x" + codePoint.toString(16).toUpperCase() + ";";
      };
      var decEscape = function(codePoint) {
        return "&#" + codePoint + ";";
      };
      var parseError = function(message) {
        throw Error("Parse error: " + message);
      };
      var encode = function(string, options) {
        options = merge(options, encode.options);
        var strict = options.strict;
        if (strict && regexInvalidRawCodePoint.test(string)) {
          parseError("forbidden code point");
        }
        var encodeEverything = options.encodeEverything;
        var useNamedReferences = options.useNamedReferences;
        var allowUnsafeSymbols = options.allowUnsafeSymbols;
        var escapeCodePoint = options.decimal ? decEscape : hexEscape;
        var escapeBmpSymbol = function(symbol) {
          return escapeCodePoint(symbol.charCodeAt(0));
        };
        if (encodeEverything) {
          string = string.replace(regexAsciiWhitelist, function(symbol) {
            if (useNamedReferences && has(encodeMap, symbol)) {
              return "&" + encodeMap[symbol] + ";";
            }
            return escapeBmpSymbol(symbol);
          });
          if (useNamedReferences) {
            string = string.replace(/&gt;\u20D2/g, "&nvgt;").replace(/&lt;\u20D2/g, "&nvlt;").replace(/&#x66;&#x6A;/g, "&fjlig;");
          }
          if (useNamedReferences) {
            string = string.replace(regexEncodeNonAscii, function(string2) {
              return "&" + encodeMap[string2] + ";";
            });
          }
        } else if (useNamedReferences) {
          if (!allowUnsafeSymbols) {
            string = string.replace(regexEscape, function(string2) {
              return "&" + encodeMap[string2] + ";";
            });
          }
          string = string.replace(/&gt;\u20D2/g, "&nvgt;").replace(/&lt;\u20D2/g, "&nvlt;");
          string = string.replace(regexEncodeNonAscii, function(string2) {
            return "&" + encodeMap[string2] + ";";
          });
        } else if (!allowUnsafeSymbols) {
          string = string.replace(regexEscape, escapeBmpSymbol);
        }
        return string.replace(regexAstralSymbols, function($0) {
          var high = $0.charCodeAt(0);
          var low = $0.charCodeAt(1);
          var codePoint = (high - 55296) * 1024 + low - 56320 + 65536;
          return escapeCodePoint(codePoint);
        }).replace(regexBmpWhitelist, escapeBmpSymbol);
      };
      encode.options = {
        "allowUnsafeSymbols": false,
        "encodeEverything": false,
        "strict": false,
        "useNamedReferences": false,
        "decimal": false
      };
      var decode = function(html, options) {
        options = merge(options, decode.options);
        var strict = options.strict;
        if (strict && regexInvalidEntity.test(html)) {
          parseError("malformed character reference");
        }
        return html.replace(regexDecode, function($0, $1, $2, $3, $4, $5, $6, $7, $8) {
          var codePoint;
          var semicolon;
          var decDigits;
          var hexDigits;
          var reference;
          var next;
          if ($1) {
            reference = $1;
            return decodeMap[reference];
          }
          if ($2) {
            reference = $2;
            next = $3;
            if (next && options.isAttributeValue) {
              if (strict && next == "=") {
                parseError("`&` did not start a character reference");
              }
              return $0;
            } else {
              if (strict) {
                parseError(
                  "named character reference was not terminated by a semicolon"
                );
              }
              return decodeMapLegacy[reference] + (next || "");
            }
          }
          if ($4) {
            decDigits = $4;
            semicolon = $5;
            if (strict && !semicolon) {
              parseError("character reference was not terminated by a semicolon");
            }
            codePoint = parseInt(decDigits, 10);
            return codePointToSymbol(codePoint, strict);
          }
          if ($6) {
            hexDigits = $6;
            semicolon = $7;
            if (strict && !semicolon) {
              parseError("character reference was not terminated by a semicolon");
            }
            codePoint = parseInt(hexDigits, 16);
            return codePointToSymbol(codePoint, strict);
          }
          if (strict) {
            parseError(
              "named character reference was not terminated by a semicolon"
            );
          }
          return $0;
        });
      };
      decode.options = {
        "isAttributeValue": false,
        "strict": false
      };
      var escape = function(string) {
        return string.replace(regexEscape, function($0) {
          return escapeMap[$0];
        });
      };
      var he = {
        "version": "1.2.0",
        "encode": encode,
        "decode": decode,
        "escape": escape,
        "unescape": decode
      };
      if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
        define(function() {
          return he;
        });
      } else if (freeExports && !freeExports.nodeType) {
        if (freeModule) {
          freeModule.exports = he;
        } else {
          for (var key in he) {
            has(he, key) && (freeExports[key] = he[key]);
          }
        }
      } else {
        root.he = he;
      }
    })(exports2);
  }
});

// node_modules/mocha/lib/utils.js
var require_utils = __commonJS({
  "node_modules/mocha/lib/utils.js"(exports2) {
    "use strict";
    var path2 = require("node:path");
    var util = require("node:util");
    var he = require_he();
    var MOCHA_ID_PROP_NAME = "__mocha_id__";
    exports2.inherits = util.inherits;
    exports2.escape = function(html) {
      return he.encode(String(html), { useNamedReferences: false });
    };
    exports2.isString = function(obj) {
      return typeof obj === "string";
    };
    exports2.slug = function(str) {
      return str.toLowerCase().replace(/\s+/g, "-").replace(/[^-\w]/g, "").replace(/-{2,}/g, "-");
    };
    exports2.clean = function(str) {
      str = str.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, "").replace(
        /^function(?:\s*|\s[^(]*)\([^)]*\)\s*\{((?:.|\n)*?)\}$|^\([^)]*\)\s*=>\s*(?:\{((?:.|\n)*?)\}|((?:.|\n)*))$/,
        "$1$2$3"
      );
      var spaces = str.match(/^\n?( *)/)[1].length;
      var tabs = str.match(/^\n?(\t*)/)[1].length;
      var re = new RegExp(
        "^\n?" + (tabs ? "	" : " ") + "{" + (tabs || spaces) + "}",
        "gm"
      );
      str = str.replace(re, "");
      return str.trim();
    };
    function emptyRepresentation(value, typeHint) {
      switch (typeHint) {
        case "function":
          return "[Function]";
        case "object":
          return "{}";
        case "array":
          return "[]";
        default:
          return value.toString();
      }
    }
    var canonicalType = exports2.canonicalType = function canonicalType2(value) {
      if (value === void 0) {
        return "undefined";
      } else if (value === null) {
        return "null";
      } else if (Buffer.isBuffer(value)) {
        return "buffer";
      } else if (Object.getPrototypeOf(value) === null) {
        return "null-prototype";
      }
      return Object.prototype.toString.call(value).replace(/^\[.+\s(.+?)]$/, "$1").toLowerCase();
    };
    exports2.type = function type(value) {
      if (value === null) return "null";
      const primitives = /* @__PURE__ */ new Set([
        "undefined",
        "boolean",
        "number",
        "string",
        "bigint",
        "symbol"
      ]);
      const _type = typeof value;
      if (_type === "function") return _type;
      if (primitives.has(_type)) return _type;
      if (value instanceof String) return "string";
      if (value instanceof Error) return "error";
      if (Array.isArray(value)) return "array";
      return _type;
    };
    exports2.stringify = function(value) {
      var typeHint = canonicalType(value);
      if (!~["object", "array", "function", "null-prototype"].indexOf(typeHint)) {
        if (typeHint === "buffer") {
          var json = Buffer.prototype.toJSON.call(value);
          return jsonStringify(
            json.data && json.type ? json.data : json,
            2
          ).replace(/,(\n|$)/g, "$1");
        }
        if (typeHint === "string" && typeof value === "object") {
          value = value.split("").reduce(function(acc, char, idx) {
            acc[idx] = char;
            return acc;
          }, {});
          typeHint = "object";
        } else {
          return jsonStringify(value);
        }
      }
      for (var prop in value) {
        if (Object.prototype.hasOwnProperty.call(value, prop)) {
          return jsonStringify(
            exports2.canonicalize(value, null, typeHint),
            2
          ).replace(/,(\n|$)/g, "$1");
        }
      }
      return emptyRepresentation(value, typeHint);
    };
    function jsonStringify(object, spaces, depth) {
      if (typeof spaces === "undefined") {
        return _stringify(object);
      }
      depth = depth || 1;
      var space = spaces * depth;
      var str = Array.isArray(object) ? "[" : "{";
      var end = Array.isArray(object) ? "]" : "}";
      var length = typeof object.length === "number" ? object.length : Object.keys(object).length;
      function repeat(s, n) {
        return new Array(n).join(s);
      }
      function _stringify(val) {
        switch (canonicalType(val)) {
          case "null":
          case "undefined":
            val = "[" + val + "]";
            break;
          case "array":
          case "object":
            val = jsonStringify(val, spaces, depth + 1);
            break;
          case "boolean":
          case "regexp":
          case "symbol":
          case "number":
            val = val === 0 && 1 / val === -Infinity ? "-0" : val.toString();
            break;
          case "bigint":
            val = val.toString() + "n";
            break;
          case "date":
            var sDate = isNaN(val.getTime()) ? val.toString() : val.toISOString();
            val = "[Date: " + sDate + "]";
            break;
          case "buffer":
            var json = val.toJSON();
            json = json.data && json.type ? json.data : json;
            val = "[Buffer: " + jsonStringify(json, 2, depth + 1) + "]";
            break;
          default:
            val = val === "[Function]" || val === "[Circular]" ? val : JSON.stringify(val);
        }
        return val;
      }
      for (var i in object) {
        if (!Object.prototype.hasOwnProperty.call(object, i)) {
          continue;
        }
        --length;
        str += "\n " + repeat(" ", space) + (Array.isArray(object) ? "" : '"' + i + '": ') + // key
        _stringify(object[i]) + // value
        (length ? "," : "");
      }
      return str + // [], {}
      (str.length !== 1 ? "\n" + repeat(" ", --space) + end : end);
    }
    exports2.canonicalize = function canonicalize(value, stack, typeHint) {
      var canonicalizedObj;
      var prop;
      typeHint = typeHint || canonicalType(value);
      function withStack(value2, fn) {
        stack.push(value2);
        fn();
        stack.pop();
      }
      stack = stack || [];
      if (stack.indexOf(value) !== -1) {
        return "[Circular]";
      }
      switch (typeHint) {
        case "undefined":
        case "buffer":
        case "null":
          canonicalizedObj = value;
          break;
        case "array":
          withStack(value, function() {
            canonicalizedObj = value.map(function(item) {
              return exports2.canonicalize(item, stack);
            });
          });
          break;
        case "function":
          for (prop in value) {
            canonicalizedObj = {};
            break;
          }
          if (!canonicalizedObj) {
            canonicalizedObj = emptyRepresentation(value, typeHint);
            break;
          }
        /* falls through */
        case "null-prototype":
        case "object":
          canonicalizedObj = canonicalizedObj || {};
          if (typeHint === "null-prototype" && Symbol.toStringTag in value) {
            canonicalizedObj["[Symbol.toStringTag]"] = value[Symbol.toStringTag];
          }
          withStack(value, function() {
            Object.keys(value).sort().forEach(function(key) {
              canonicalizedObj[key] = exports2.canonicalize(value[key], stack);
            });
          });
          break;
        case "date":
        case "number":
        case "regexp":
        case "boolean":
        case "symbol":
          canonicalizedObj = value;
          break;
        default:
          canonicalizedObj = value + "";
      }
      return canonicalizedObj;
    };
    exports2.stackTraceFilter = function() {
      var is = typeof document === "undefined" ? { node: true } : { browser: true };
      var slash = path2.sep;
      var cwd;
      if (is.node) {
        cwd = exports2.cwd() + slash;
      } else {
        cwd = (typeof location === "undefined" ? window.location : location).href.replace(/\/[^/]*$/, "/");
        slash = "/";
      }
      function isMochaInternal(line) {
        return ~line.indexOf("node_modules" + slash + "mocha" + slash) || ~line.indexOf(slash + "mocha.js") || ~line.indexOf(slash + "mocha.min.js");
      }
      function isNodeInternal(line) {
        return ~line.indexOf("(timers.js:") || ~line.indexOf("(events.js:") || ~line.indexOf("(node.js:") || ~line.indexOf("(module.js:") || ~line.indexOf("GeneratorFunctionPrototype.next (native)") || false;
      }
      return function(stack) {
        stack = stack.split("\n");
        stack = stack.reduce(function(list, line) {
          if (isMochaInternal(line)) {
            return list;
          }
          if (is.node && isNodeInternal(line)) {
            return list;
          }
          if (/:\d+:\d+\)?$/.test(line)) {
            line = line.replace("(" + cwd, "(");
          }
          list.push(line);
          return list;
        }, []);
        return stack.join("\n");
      };
    };
    exports2.isPromise = function isPromise(value) {
      return typeof value === "object" && value !== null && typeof value.then === "function";
    };
    exports2.clamp = function clamp(value, range) {
      return Math.min(Math.max(value, range[0]), range[1]);
    };
    exports2.noop = function() {
    };
    exports2.createMap = function() {
      return Object.assign.apply(
        null,
        [/* @__PURE__ */ Object.create(null)].concat(Array.prototype.slice.call(arguments))
      );
    };
    exports2.defineConstants = function(obj) {
      if (canonicalType(obj) !== "object" || !Object.keys(obj).length) {
        throw new TypeError("Invalid argument; expected a non-empty object");
      }
      return Object.freeze(exports2.createMap(obj));
    };
    exports2.cwd = function cwd() {
      return process.cwd();
    };
    exports2.isBrowser = function isBrowser() {
      return Boolean(process.browser);
    };
    exports2.castArray = function castArray(value) {
      if (value === void 0) {
        return [];
      }
      if (value === null) {
        return [null];
      }
      if (typeof value === "object" && (typeof value[Symbol.iterator] === "function" || value.length !== void 0)) {
        return Array.from(value);
      }
      return [value];
    };
    exports2.constants = exports2.defineConstants({
      MOCHA_ID_PROP_NAME
    });
    var uniqueIDBase = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
    exports2.uniqueID = () => {
      let id = "";
      for (let i = 0; i < 21; i++) {
        id += uniqueIDBase[Math.random() * 64 | 0];
      }
      return id;
    };
    exports2.assignNewMochaID = (obj) => {
      const id = exports2.uniqueID();
      Object.defineProperty(obj, MOCHA_ID_PROP_NAME, {
        get() {
          return id;
        }
      });
      return obj;
    };
    exports2.getMochaID = (obj) => obj && typeof obj === "object" ? obj[MOCHA_ID_PROP_NAME] : void 0;
    exports2.breakCircularDeps = (inputObj) => {
      const seen = /* @__PURE__ */ new Set();
      function _breakCircularDeps(obj) {
        if (obj && typeof obj !== "object") {
          return obj;
        }
        if (seen.has(obj)) {
          return "[Circular]";
        }
        seen.add(obj);
        for (const k in obj) {
          const descriptor = Object.getOwnPropertyDescriptor(obj, k);
          if (descriptor && descriptor.writable) {
            obj[k] = _breakCircularDeps(obj[k], k);
          }
        }
        seen.delete(obj);
        return obj;
      }
      return _breakCircularDeps(inputObj);
    };
    exports2.isNumeric = (input) => {
      return !isNaN(parseFloat(input));
    };
  }
});

// node_modules/has-flag/index.js
var require_has_flag = __commonJS({
  "node_modules/has-flag/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (flag, argv = process.argv) => {
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const position = argv.indexOf(prefix + flag);
      const terminatorPosition = argv.indexOf("--");
      return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
    };
  }
});

// node_modules/mocha/node_modules/supports-color/index.js
var require_supports_color = __commonJS({
  "node_modules/mocha/node_modules/supports-color/index.js"(exports2, module2) {
    "use strict";
    var os = require("os");
    var tty = require("tty");
    var hasFlag = require_has_flag();
    var { env } = process;
    var flagForceColor;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      flagForceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      flagForceColor = 1;
    }
    function envForceColor() {
      if ("FORCE_COLOR" in env) {
        if (env.FORCE_COLOR === "true") {
          return 1;
        }
        if (env.FORCE_COLOR === "false") {
          return 0;
        }
        return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
      const noFlagForceColor = envForceColor();
      if (noFlagForceColor !== void 0) {
        flagForceColor = noFlagForceColor;
      }
      const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
      if (forceColor === 0) {
        return 0;
      }
      if (sniffFlags) {
        if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
          return 3;
        }
        if (hasFlag("color=256")) {
          return 2;
        }
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease = os.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE", "DRONE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env) {
        const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env) {
        return 1;
      }
      return min;
    }
    function getSupportLevel(stream, options = {}) {
      const level = supportsColor(stream, {
        streamIsTTY: stream && stream.isTTY,
        ...options
      });
      return translateLevel(level);
    }
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: getSupportLevel({ isTTY: tty.isatty(1) }),
      stderr: getSupportLevel({ isTTY: tty.isatty(2) })
    };
  }
});

// node_modules/color-name/index.js
var require_color_name = __commonJS({
  "node_modules/color-name/index.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      "aliceblue": [240, 248, 255],
      "antiquewhite": [250, 235, 215],
      "aqua": [0, 255, 255],
      "aquamarine": [127, 255, 212],
      "azure": [240, 255, 255],
      "beige": [245, 245, 220],
      "bisque": [255, 228, 196],
      "black": [0, 0, 0],
      "blanchedalmond": [255, 235, 205],
      "blue": [0, 0, 255],
      "blueviolet": [138, 43, 226],
      "brown": [165, 42, 42],
      "burlywood": [222, 184, 135],
      "cadetblue": [95, 158, 160],
      "chartreuse": [127, 255, 0],
      "chocolate": [210, 105, 30],
      "coral": [255, 127, 80],
      "cornflowerblue": [100, 149, 237],
      "cornsilk": [255, 248, 220],
      "crimson": [220, 20, 60],
      "cyan": [0, 255, 255],
      "darkblue": [0, 0, 139],
      "darkcyan": [0, 139, 139],
      "darkgoldenrod": [184, 134, 11],
      "darkgray": [169, 169, 169],
      "darkgreen": [0, 100, 0],
      "darkgrey": [169, 169, 169],
      "darkkhaki": [189, 183, 107],
      "darkmagenta": [139, 0, 139],
      "darkolivegreen": [85, 107, 47],
      "darkorange": [255, 140, 0],
      "darkorchid": [153, 50, 204],
      "darkred": [139, 0, 0],
      "darksalmon": [233, 150, 122],
      "darkseagreen": [143, 188, 143],
      "darkslateblue": [72, 61, 139],
      "darkslategray": [47, 79, 79],
      "darkslategrey": [47, 79, 79],
      "darkturquoise": [0, 206, 209],
      "darkviolet": [148, 0, 211],
      "deeppink": [255, 20, 147],
      "deepskyblue": [0, 191, 255],
      "dimgray": [105, 105, 105],
      "dimgrey": [105, 105, 105],
      "dodgerblue": [30, 144, 255],
      "firebrick": [178, 34, 34],
      "floralwhite": [255, 250, 240],
      "forestgreen": [34, 139, 34],
      "fuchsia": [255, 0, 255],
      "gainsboro": [220, 220, 220],
      "ghostwhite": [248, 248, 255],
      "gold": [255, 215, 0],
      "goldenrod": [218, 165, 32],
      "gray": [128, 128, 128],
      "green": [0, 128, 0],
      "greenyellow": [173, 255, 47],
      "grey": [128, 128, 128],
      "honeydew": [240, 255, 240],
      "hotpink": [255, 105, 180],
      "indianred": [205, 92, 92],
      "indigo": [75, 0, 130],
      "ivory": [255, 255, 240],
      "khaki": [240, 230, 140],
      "lavender": [230, 230, 250],
      "lavenderblush": [255, 240, 245],
      "lawngreen": [124, 252, 0],
      "lemonchiffon": [255, 250, 205],
      "lightblue": [173, 216, 230],
      "lightcoral": [240, 128, 128],
      "lightcyan": [224, 255, 255],
      "lightgoldenrodyellow": [250, 250, 210],
      "lightgray": [211, 211, 211],
      "lightgreen": [144, 238, 144],
      "lightgrey": [211, 211, 211],
      "lightpink": [255, 182, 193],
      "lightsalmon": [255, 160, 122],
      "lightseagreen": [32, 178, 170],
      "lightskyblue": [135, 206, 250],
      "lightslategray": [119, 136, 153],
      "lightslategrey": [119, 136, 153],
      "lightsteelblue": [176, 196, 222],
      "lightyellow": [255, 255, 224],
      "lime": [0, 255, 0],
      "limegreen": [50, 205, 50],
      "linen": [250, 240, 230],
      "magenta": [255, 0, 255],
      "maroon": [128, 0, 0],
      "mediumaquamarine": [102, 205, 170],
      "mediumblue": [0, 0, 205],
      "mediumorchid": [186, 85, 211],
      "mediumpurple": [147, 112, 219],
      "mediumseagreen": [60, 179, 113],
      "mediumslateblue": [123, 104, 238],
      "mediumspringgreen": [0, 250, 154],
      "mediumturquoise": [72, 209, 204],
      "mediumvioletred": [199, 21, 133],
      "midnightblue": [25, 25, 112],
      "mintcream": [245, 255, 250],
      "mistyrose": [255, 228, 225],
      "moccasin": [255, 228, 181],
      "navajowhite": [255, 222, 173],
      "navy": [0, 0, 128],
      "oldlace": [253, 245, 230],
      "olive": [128, 128, 0],
      "olivedrab": [107, 142, 35],
      "orange": [255, 165, 0],
      "orangered": [255, 69, 0],
      "orchid": [218, 112, 214],
      "palegoldenrod": [238, 232, 170],
      "palegreen": [152, 251, 152],
      "paleturquoise": [175, 238, 238],
      "palevioletred": [219, 112, 147],
      "papayawhip": [255, 239, 213],
      "peachpuff": [255, 218, 185],
      "peru": [205, 133, 63],
      "pink": [255, 192, 203],
      "plum": [221, 160, 221],
      "powderblue": [176, 224, 230],
      "purple": [128, 0, 128],
      "rebeccapurple": [102, 51, 153],
      "red": [255, 0, 0],
      "rosybrown": [188, 143, 143],
      "royalblue": [65, 105, 225],
      "saddlebrown": [139, 69, 19],
      "salmon": [250, 128, 114],
      "sandybrown": [244, 164, 96],
      "seagreen": [46, 139, 87],
      "seashell": [255, 245, 238],
      "sienna": [160, 82, 45],
      "silver": [192, 192, 192],
      "skyblue": [135, 206, 235],
      "slateblue": [106, 90, 205],
      "slategray": [112, 128, 144],
      "slategrey": [112, 128, 144],
      "snow": [255, 250, 250],
      "springgreen": [0, 255, 127],
      "steelblue": [70, 130, 180],
      "tan": [210, 180, 140],
      "teal": [0, 128, 128],
      "thistle": [216, 191, 216],
      "tomato": [255, 99, 71],
      "turquoise": [64, 224, 208],
      "violet": [238, 130, 238],
      "wheat": [245, 222, 179],
      "white": [255, 255, 255],
      "whitesmoke": [245, 245, 245],
      "yellow": [255, 255, 0],
      "yellowgreen": [154, 205, 50]
    };
  }
});

// node_modules/color-convert/conversions.js
var require_conversions = __commonJS({
  "node_modules/color-convert/conversions.js"(exports2, module2) {
    var cssKeywords = require_color_name();
    var reverseKeywords = {};
    for (const key of Object.keys(cssKeywords)) {
      reverseKeywords[cssKeywords[key]] = key;
    }
    var convert = {
      rgb: { channels: 3, labels: "rgb" },
      hsl: { channels: 3, labels: "hsl" },
      hsv: { channels: 3, labels: "hsv" },
      hwb: { channels: 3, labels: "hwb" },
      cmyk: { channels: 4, labels: "cmyk" },
      xyz: { channels: 3, labels: "xyz" },
      lab: { channels: 3, labels: "lab" },
      lch: { channels: 3, labels: "lch" },
      hex: { channels: 1, labels: ["hex"] },
      keyword: { channels: 1, labels: ["keyword"] },
      ansi16: { channels: 1, labels: ["ansi16"] },
      ansi256: { channels: 1, labels: ["ansi256"] },
      hcg: { channels: 3, labels: ["h", "c", "g"] },
      apple: { channels: 3, labels: ["r16", "g16", "b16"] },
      gray: { channels: 1, labels: ["gray"] }
    };
    module2.exports = convert;
    for (const model of Object.keys(convert)) {
      if (!("channels" in convert[model])) {
        throw new Error("missing channels property: " + model);
      }
      if (!("labels" in convert[model])) {
        throw new Error("missing channel labels property: " + model);
      }
      if (convert[model].labels.length !== convert[model].channels) {
        throw new Error("channel and label counts mismatch: " + model);
      }
      const { channels, labels } = convert[model];
      delete convert[model].channels;
      delete convert[model].labels;
      Object.defineProperty(convert[model], "channels", { value: channels });
      Object.defineProperty(convert[model], "labels", { value: labels });
    }
    convert.rgb.hsl = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const min = Math.min(r, g, b);
      const max = Math.max(r, g, b);
      const delta = max - min;
      let h;
      let s;
      if (max === min) {
        h = 0;
      } else if (r === max) {
        h = (g - b) / delta;
      } else if (g === max) {
        h = 2 + (b - r) / delta;
      } else if (b === max) {
        h = 4 + (r - g) / delta;
      }
      h = Math.min(h * 60, 360);
      if (h < 0) {
        h += 360;
      }
      const l = (min + max) / 2;
      if (max === min) {
        s = 0;
      } else if (l <= 0.5) {
        s = delta / (max + min);
      } else {
        s = delta / (2 - max - min);
      }
      return [h, s * 100, l * 100];
    };
    convert.rgb.hsv = function(rgb) {
      let rdif;
      let gdif;
      let bdif;
      let h;
      let s;
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const v = Math.max(r, g, b);
      const diff = v - Math.min(r, g, b);
      const diffc = function(c) {
        return (v - c) / 6 / diff + 1 / 2;
      };
      if (diff === 0) {
        h = 0;
        s = 0;
      } else {
        s = diff / v;
        rdif = diffc(r);
        gdif = diffc(g);
        bdif = diffc(b);
        if (r === v) {
          h = bdif - gdif;
        } else if (g === v) {
          h = 1 / 3 + rdif - bdif;
        } else if (b === v) {
          h = 2 / 3 + gdif - rdif;
        }
        if (h < 0) {
          h += 1;
        } else if (h > 1) {
          h -= 1;
        }
      }
      return [
        h * 360,
        s * 100,
        v * 100
      ];
    };
    convert.rgb.hwb = function(rgb) {
      const r = rgb[0];
      const g = rgb[1];
      let b = rgb[2];
      const h = convert.rgb.hsl(rgb)[0];
      const w = 1 / 255 * Math.min(r, Math.min(g, b));
      b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
      return [h, w * 100, b * 100];
    };
    convert.rgb.cmyk = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const k = Math.min(1 - r, 1 - g, 1 - b);
      const c = (1 - r - k) / (1 - k) || 0;
      const m = (1 - g - k) / (1 - k) || 0;
      const y = (1 - b - k) / (1 - k) || 0;
      return [c * 100, m * 100, y * 100, k * 100];
    };
    function comparativeDistance(x, y) {
      return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2;
    }
    convert.rgb.keyword = function(rgb) {
      const reversed = reverseKeywords[rgb];
      if (reversed) {
        return reversed;
      }
      let currentClosestDistance = Infinity;
      let currentClosestKeyword;
      for (const keyword of Object.keys(cssKeywords)) {
        const value = cssKeywords[keyword];
        const distance = comparativeDistance(rgb, value);
        if (distance < currentClosestDistance) {
          currentClosestDistance = distance;
          currentClosestKeyword = keyword;
        }
      }
      return currentClosestKeyword;
    };
    convert.keyword.rgb = function(keyword) {
      return cssKeywords[keyword];
    };
    convert.rgb.xyz = function(rgb) {
      let r = rgb[0] / 255;
      let g = rgb[1] / 255;
      let b = rgb[2] / 255;
      r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
      g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
      b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;
      const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
      const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
      const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
      return [x * 100, y * 100, z * 100];
    };
    convert.rgb.lab = function(rgb) {
      const xyz = convert.rgb.xyz(rgb);
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert.hsl.rgb = function(hsl) {
      const h = hsl[0] / 360;
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      let t2;
      let t3;
      let val;
      if (s === 0) {
        val = l * 255;
        return [val, val, val];
      }
      if (l < 0.5) {
        t2 = l * (1 + s);
      } else {
        t2 = l + s - l * s;
      }
      const t1 = 2 * l - t2;
      const rgb = [0, 0, 0];
      for (let i = 0; i < 3; i++) {
        t3 = h + 1 / 3 * -(i - 1);
        if (t3 < 0) {
          t3++;
        }
        if (t3 > 1) {
          t3--;
        }
        if (6 * t3 < 1) {
          val = t1 + (t2 - t1) * 6 * t3;
        } else if (2 * t3 < 1) {
          val = t2;
        } else if (3 * t3 < 2) {
          val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        } else {
          val = t1;
        }
        rgb[i] = val * 255;
      }
      return rgb;
    };
    convert.hsl.hsv = function(hsl) {
      const h = hsl[0];
      let s = hsl[1] / 100;
      let l = hsl[2] / 100;
      let smin = s;
      const lmin = Math.max(l, 0.01);
      l *= 2;
      s *= l <= 1 ? l : 2 - l;
      smin *= lmin <= 1 ? lmin : 2 - lmin;
      const v = (l + s) / 2;
      const sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
      return [h, sv * 100, v * 100];
    };
    convert.hsv.rgb = function(hsv) {
      const h = hsv[0] / 60;
      const s = hsv[1] / 100;
      let v = hsv[2] / 100;
      const hi = Math.floor(h) % 6;
      const f = h - Math.floor(h);
      const p = 255 * v * (1 - s);
      const q = 255 * v * (1 - s * f);
      const t = 255 * v * (1 - s * (1 - f));
      v *= 255;
      switch (hi) {
        case 0:
          return [v, t, p];
        case 1:
          return [q, v, p];
        case 2:
          return [p, v, t];
        case 3:
          return [p, q, v];
        case 4:
          return [t, p, v];
        case 5:
          return [v, p, q];
      }
    };
    convert.hsv.hsl = function(hsv) {
      const h = hsv[0];
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const vmin = Math.max(v, 0.01);
      let sl;
      let l;
      l = (2 - s) * v;
      const lmin = (2 - s) * vmin;
      sl = s * vmin;
      sl /= lmin <= 1 ? lmin : 2 - lmin;
      sl = sl || 0;
      l /= 2;
      return [h, sl * 100, l * 100];
    };
    convert.hwb.rgb = function(hwb) {
      const h = hwb[0] / 360;
      let wh = hwb[1] / 100;
      let bl = hwb[2] / 100;
      const ratio = wh + bl;
      let f;
      if (ratio > 1) {
        wh /= ratio;
        bl /= ratio;
      }
      const i = Math.floor(6 * h);
      const v = 1 - bl;
      f = 6 * h - i;
      if ((i & 1) !== 0) {
        f = 1 - f;
      }
      const n = wh + f * (v - wh);
      let r;
      let g;
      let b;
      switch (i) {
        default:
        case 6:
        case 0:
          r = v;
          g = n;
          b = wh;
          break;
        case 1:
          r = n;
          g = v;
          b = wh;
          break;
        case 2:
          r = wh;
          g = v;
          b = n;
          break;
        case 3:
          r = wh;
          g = n;
          b = v;
          break;
        case 4:
          r = n;
          g = wh;
          b = v;
          break;
        case 5:
          r = v;
          g = wh;
          b = n;
          break;
      }
      return [r * 255, g * 255, b * 255];
    };
    convert.cmyk.rgb = function(cmyk) {
      const c = cmyk[0] / 100;
      const m = cmyk[1] / 100;
      const y = cmyk[2] / 100;
      const k = cmyk[3] / 100;
      const r = 1 - Math.min(1, c * (1 - k) + k);
      const g = 1 - Math.min(1, m * (1 - k) + k);
      const b = 1 - Math.min(1, y * (1 - k) + k);
      return [r * 255, g * 255, b * 255];
    };
    convert.xyz.rgb = function(xyz) {
      const x = xyz[0] / 100;
      const y = xyz[1] / 100;
      const z = xyz[2] / 100;
      let r;
      let g;
      let b;
      r = x * 3.2406 + y * -1.5372 + z * -0.4986;
      g = x * -0.9689 + y * 1.8758 + z * 0.0415;
      b = x * 0.0557 + y * -0.204 + z * 1.057;
      r = r > 31308e-7 ? 1.055 * r ** (1 / 2.4) - 0.055 : r * 12.92;
      g = g > 31308e-7 ? 1.055 * g ** (1 / 2.4) - 0.055 : g * 12.92;
      b = b > 31308e-7 ? 1.055 * b ** (1 / 2.4) - 0.055 : b * 12.92;
      r = Math.min(Math.max(0, r), 1);
      g = Math.min(Math.max(0, g), 1);
      b = Math.min(Math.max(0, b), 1);
      return [r * 255, g * 255, b * 255];
    };
    convert.xyz.lab = function(xyz) {
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert.lab.xyz = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let x;
      let y;
      let z;
      y = (l + 16) / 116;
      x = a / 500 + y;
      z = y - b / 200;
      const y2 = y ** 3;
      const x2 = x ** 3;
      const z2 = z ** 3;
      y = y2 > 8856e-6 ? y2 : (y - 16 / 116) / 7.787;
      x = x2 > 8856e-6 ? x2 : (x - 16 / 116) / 7.787;
      z = z2 > 8856e-6 ? z2 : (z - 16 / 116) / 7.787;
      x *= 95.047;
      y *= 100;
      z *= 108.883;
      return [x, y, z];
    };
    convert.lab.lch = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let h;
      const hr = Math.atan2(b, a);
      h = hr * 360 / 2 / Math.PI;
      if (h < 0) {
        h += 360;
      }
      const c = Math.sqrt(a * a + b * b);
      return [l, c, h];
    };
    convert.lch.lab = function(lch) {
      const l = lch[0];
      const c = lch[1];
      const h = lch[2];
      const hr = h / 360 * 2 * Math.PI;
      const a = c * Math.cos(hr);
      const b = c * Math.sin(hr);
      return [l, a, b];
    };
    convert.rgb.ansi16 = function(args, saturation = null) {
      const [r, g, b] = args;
      let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation;
      value = Math.round(value / 50);
      if (value === 0) {
        return 30;
      }
      let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
      if (value === 2) {
        ansi += 60;
      }
      return ansi;
    };
    convert.hsv.ansi16 = function(args) {
      return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
    };
    convert.rgb.ansi256 = function(args) {
      const r = args[0];
      const g = args[1];
      const b = args[2];
      if (r === g && g === b) {
        if (r < 8) {
          return 16;
        }
        if (r > 248) {
          return 231;
        }
        return Math.round((r - 8) / 247 * 24) + 232;
      }
      const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
      return ansi;
    };
    convert.ansi16.rgb = function(args) {
      let color = args % 10;
      if (color === 0 || color === 7) {
        if (args > 50) {
          color += 3.5;
        }
        color = color / 10.5 * 255;
        return [color, color, color];
      }
      const mult = (~~(args > 50) + 1) * 0.5;
      const r = (color & 1) * mult * 255;
      const g = (color >> 1 & 1) * mult * 255;
      const b = (color >> 2 & 1) * mult * 255;
      return [r, g, b];
    };
    convert.ansi256.rgb = function(args) {
      if (args >= 232) {
        const c = (args - 232) * 10 + 8;
        return [c, c, c];
      }
      args -= 16;
      let rem;
      const r = Math.floor(args / 36) / 5 * 255;
      const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
      const b = rem % 6 / 5 * 255;
      return [r, g, b];
    };
    convert.rgb.hex = function(args) {
      const integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
      const string = integer.toString(16).toUpperCase();
      return "000000".substring(string.length) + string;
    };
    convert.hex.rgb = function(args) {
      const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
      if (!match) {
        return [0, 0, 0];
      }
      let colorString = match[0];
      if (match[0].length === 3) {
        colorString = colorString.split("").map((char) => {
          return char + char;
        }).join("");
      }
      const integer = parseInt(colorString, 16);
      const r = integer >> 16 & 255;
      const g = integer >> 8 & 255;
      const b = integer & 255;
      return [r, g, b];
    };
    convert.rgb.hcg = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const max = Math.max(Math.max(r, g), b);
      const min = Math.min(Math.min(r, g), b);
      const chroma = max - min;
      let grayscale;
      let hue;
      if (chroma < 1) {
        grayscale = min / (1 - chroma);
      } else {
        grayscale = 0;
      }
      if (chroma <= 0) {
        hue = 0;
      } else if (max === r) {
        hue = (g - b) / chroma % 6;
      } else if (max === g) {
        hue = 2 + (b - r) / chroma;
      } else {
        hue = 4 + (r - g) / chroma;
      }
      hue /= 6;
      hue %= 1;
      return [hue * 360, chroma * 100, grayscale * 100];
    };
    convert.hsl.hcg = function(hsl) {
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      const c = l < 0.5 ? 2 * s * l : 2 * s * (1 - l);
      let f = 0;
      if (c < 1) {
        f = (l - 0.5 * c) / (1 - c);
      }
      return [hsl[0], c * 100, f * 100];
    };
    convert.hsv.hcg = function(hsv) {
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const c = s * v;
      let f = 0;
      if (c < 1) {
        f = (v - c) / (1 - c);
      }
      return [hsv[0], c * 100, f * 100];
    };
    convert.hcg.rgb = function(hcg) {
      const h = hcg[0] / 360;
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      if (c === 0) {
        return [g * 255, g * 255, g * 255];
      }
      const pure = [0, 0, 0];
      const hi = h % 1 * 6;
      const v = hi % 1;
      const w = 1 - v;
      let mg = 0;
      switch (Math.floor(hi)) {
        case 0:
          pure[0] = 1;
          pure[1] = v;
          pure[2] = 0;
          break;
        case 1:
          pure[0] = w;
          pure[1] = 1;
          pure[2] = 0;
          break;
        case 2:
          pure[0] = 0;
          pure[1] = 1;
          pure[2] = v;
          break;
        case 3:
          pure[0] = 0;
          pure[1] = w;
          pure[2] = 1;
          break;
        case 4:
          pure[0] = v;
          pure[1] = 0;
          pure[2] = 1;
          break;
        default:
          pure[0] = 1;
          pure[1] = 0;
          pure[2] = w;
      }
      mg = (1 - c) * g;
      return [
        (c * pure[0] + mg) * 255,
        (c * pure[1] + mg) * 255,
        (c * pure[2] + mg) * 255
      ];
    };
    convert.hcg.hsv = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      let f = 0;
      if (v > 0) {
        f = c / v;
      }
      return [hcg[0], f * 100, v * 100];
    };
    convert.hcg.hsl = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const l = g * (1 - c) + 0.5 * c;
      let s = 0;
      if (l > 0 && l < 0.5) {
        s = c / (2 * l);
      } else if (l >= 0.5 && l < 1) {
        s = c / (2 * (1 - l));
      }
      return [hcg[0], s * 100, l * 100];
    };
    convert.hcg.hwb = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      return [hcg[0], (v - c) * 100, (1 - v) * 100];
    };
    convert.hwb.hcg = function(hwb) {
      const w = hwb[1] / 100;
      const b = hwb[2] / 100;
      const v = 1 - b;
      const c = v - w;
      let g = 0;
      if (c < 1) {
        g = (v - c) / (1 - c);
      }
      return [hwb[0], c * 100, g * 100];
    };
    convert.apple.rgb = function(apple) {
      return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
    };
    convert.rgb.apple = function(rgb) {
      return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
    };
    convert.gray.rgb = function(args) {
      return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
    };
    convert.gray.hsl = function(args) {
      return [0, 0, args[0]];
    };
    convert.gray.hsv = convert.gray.hsl;
    convert.gray.hwb = function(gray) {
      return [0, 100, gray[0]];
    };
    convert.gray.cmyk = function(gray) {
      return [0, 0, 0, gray[0]];
    };
    convert.gray.lab = function(gray) {
      return [gray[0], 0, 0];
    };
    convert.gray.hex = function(gray) {
      const val = Math.round(gray[0] / 100 * 255) & 255;
      const integer = (val << 16) + (val << 8) + val;
      const string = integer.toString(16).toUpperCase();
      return "000000".substring(string.length) + string;
    };
    convert.rgb.gray = function(rgb) {
      const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
      return [val / 255 * 100];
    };
  }
});

// node_modules/color-convert/route.js
var require_route = __commonJS({
  "node_modules/color-convert/route.js"(exports2, module2) {
    var conversions = require_conversions();
    function buildGraph() {
      const graph = {};
      const models = Object.keys(conversions);
      for (let len = models.length, i = 0; i < len; i++) {
        graph[models[i]] = {
          // http://jsperf.com/1-vs-infinity
          // micro-opt, but this is simple.
          distance: -1,
          parent: null
        };
      }
      return graph;
    }
    function deriveBFS(fromModel) {
      const graph = buildGraph();
      const queue = [fromModel];
      graph[fromModel].distance = 0;
      while (queue.length) {
        const current = queue.pop();
        const adjacents = Object.keys(conversions[current]);
        for (let len = adjacents.length, i = 0; i < len; i++) {
          const adjacent = adjacents[i];
          const node = graph[adjacent];
          if (node.distance === -1) {
            node.distance = graph[current].distance + 1;
            node.parent = current;
            queue.unshift(adjacent);
          }
        }
      }
      return graph;
    }
    function link(from, to) {
      return function(args) {
        return to(from(args));
      };
    }
    function wrapConversion(toModel, graph) {
      const path2 = [graph[toModel].parent, toModel];
      let fn = conversions[graph[toModel].parent][toModel];
      let cur = graph[toModel].parent;
      while (graph[cur].parent) {
        path2.unshift(graph[cur].parent);
        fn = link(conversions[graph[cur].parent][cur], fn);
        cur = graph[cur].parent;
      }
      fn.conversion = path2;
      return fn;
    }
    module2.exports = function(fromModel) {
      const graph = deriveBFS(fromModel);
      const conversion = {};
      const models = Object.keys(graph);
      for (let len = models.length, i = 0; i < len; i++) {
        const toModel = models[i];
        const node = graph[toModel];
        if (node.parent === null) {
          continue;
        }
        conversion[toModel] = wrapConversion(toModel, graph);
      }
      return conversion;
    };
  }
});

// node_modules/color-convert/index.js
var require_color_convert = __commonJS({
  "node_modules/color-convert/index.js"(exports2, module2) {
    var conversions = require_conversions();
    var route = require_route();
    var convert = {};
    var models = Object.keys(conversions);
    function wrapRaw(fn) {
      const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        return fn(args);
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    function wrapRounded(fn) {
      const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        const result = fn(args);
        if (typeof result === "object") {
          for (let len = result.length, i = 0; i < len; i++) {
            result[i] = Math.round(result[i]);
          }
        }
        return result;
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    models.forEach((fromModel) => {
      convert[fromModel] = {};
      Object.defineProperty(convert[fromModel], "channels", { value: conversions[fromModel].channels });
      Object.defineProperty(convert[fromModel], "labels", { value: conversions[fromModel].labels });
      const routes = route(fromModel);
      const routeModels = Object.keys(routes);
      routeModels.forEach((toModel) => {
        const fn = routes[toModel];
        convert[fromModel][toModel] = wrapRounded(fn);
        convert[fromModel][toModel].raw = wrapRaw(fn);
      });
    });
    module2.exports = convert;
  }
});

// node_modules/ansi-styles/index.js
var require_ansi_styles = __commonJS({
  "node_modules/ansi-styles/index.js"(exports2, module2) {
    "use strict";
    var wrapAnsi16 = (fn, offset) => (...args) => {
      const code = fn(...args);
      return `\x1B[${code + offset}m`;
    };
    var wrapAnsi256 = (fn, offset) => (...args) => {
      const code = fn(...args);
      return `\x1B[${38 + offset};5;${code}m`;
    };
    var wrapAnsi16m = (fn, offset) => (...args) => {
      const rgb = fn(...args);
      return `\x1B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
    };
    var ansi2ansi = (n) => n;
    var rgb2rgb = (r, g, b) => [r, g, b];
    var setLazyProperty = (object, property, get) => {
      Object.defineProperty(object, property, {
        get: () => {
          const value = get();
          Object.defineProperty(object, property, {
            value,
            enumerable: true,
            configurable: true
          });
          return value;
        },
        enumerable: true,
        configurable: true
      });
    };
    var colorConvert;
    var makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
      if (colorConvert === void 0) {
        colorConvert = require_color_convert();
      }
      const offset = isBackground ? 10 : 0;
      const styles = {};
      for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
        const name = sourceSpace === "ansi16" ? "ansi" : sourceSpace;
        if (sourceSpace === targetSpace) {
          styles[name] = wrap(identity, offset);
        } else if (typeof suite === "object") {
          styles[name] = wrap(suite[targetSpace], offset);
        }
      }
      return styles;
    };
    function assembleStyles() {
      const codes = /* @__PURE__ */ new Map();
      const styles = {
        modifier: {
          reset: [0, 0],
          // 21 isn't widely supported and 22 does the same thing
          bold: [1, 22],
          dim: [2, 22],
          italic: [3, 23],
          underline: [4, 24],
          inverse: [7, 27],
          hidden: [8, 28],
          strikethrough: [9, 29]
        },
        color: {
          black: [30, 39],
          red: [31, 39],
          green: [32, 39],
          yellow: [33, 39],
          blue: [34, 39],
          magenta: [35, 39],
          cyan: [36, 39],
          white: [37, 39],
          // Bright color
          blackBright: [90, 39],
          redBright: [91, 39],
          greenBright: [92, 39],
          yellowBright: [93, 39],
          blueBright: [94, 39],
          magentaBright: [95, 39],
          cyanBright: [96, 39],
          whiteBright: [97, 39]
        },
        bgColor: {
          bgBlack: [40, 49],
          bgRed: [41, 49],
          bgGreen: [42, 49],
          bgYellow: [43, 49],
          bgBlue: [44, 49],
          bgMagenta: [45, 49],
          bgCyan: [46, 49],
          bgWhite: [47, 49],
          // Bright color
          bgBlackBright: [100, 49],
          bgRedBright: [101, 49],
          bgGreenBright: [102, 49],
          bgYellowBright: [103, 49],
          bgBlueBright: [104, 49],
          bgMagentaBright: [105, 49],
          bgCyanBright: [106, 49],
          bgWhiteBright: [107, 49]
        }
      };
      styles.color.gray = styles.color.blackBright;
      styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
      styles.color.grey = styles.color.blackBright;
      styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;
      for (const [groupName, group] of Object.entries(styles)) {
        for (const [styleName, style] of Object.entries(group)) {
          styles[styleName] = {
            open: `\x1B[${style[0]}m`,
            close: `\x1B[${style[1]}m`
          };
          group[styleName] = styles[styleName];
          codes.set(style[0], style[1]);
        }
        Object.defineProperty(styles, groupName, {
          value: group,
          enumerable: false
        });
      }
      Object.defineProperty(styles, "codes", {
        value: codes,
        enumerable: false
      });
      styles.color.close = "\x1B[39m";
      styles.bgColor.close = "\x1B[49m";
      setLazyProperty(styles.color, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, false));
      setLazyProperty(styles.color, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, false));
      setLazyProperty(styles.color, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, false));
      setLazyProperty(styles.bgColor, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, true));
      setLazyProperty(styles.bgColor, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, true));
      setLazyProperty(styles.bgColor, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, true));
      return styles;
    }
    Object.defineProperty(module2, "exports", {
      enumerable: true,
      get: assembleStyles
    });
  }
});

// node_modules/supports-color/index.js
var require_supports_color2 = __commonJS({
  "node_modules/supports-color/index.js"(exports2, module2) {
    "use strict";
    var os = require("os");
    var tty = require("tty");
    var hasFlag = require_has_flag();
    var { env } = process;
    var forceColor;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      forceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      forceColor = 1;
    }
    if ("FORCE_COLOR" in env) {
      if (env.FORCE_COLOR === "true") {
        forceColor = 1;
      } else if (env.FORCE_COLOR === "false") {
        forceColor = 0;
      } else {
        forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(haveStream, streamIsTTY) {
      if (forceColor === 0) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease = os.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env) {
        const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env) {
        return 1;
      }
      return min;
    }
    function getSupportLevel(stream) {
      const level = supportsColor(stream, stream && stream.isTTY);
      return translateLevel(level);
    }
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: translateLevel(supportsColor(true, tty.isatty(1))),
      stderr: translateLevel(supportsColor(true, tty.isatty(2)))
    };
  }
});

// node_modules/chalk/source/util.js
var require_util = __commonJS({
  "node_modules/chalk/source/util.js"(exports2, module2) {
    "use strict";
    var stringReplaceAll = (string, substring, replacer) => {
      let index = string.indexOf(substring);
      if (index === -1) {
        return string;
      }
      const substringLength = substring.length;
      let endIndex = 0;
      let returnValue = "";
      do {
        returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
        endIndex = index + substringLength;
        index = string.indexOf(substring, endIndex);
      } while (index !== -1);
      returnValue += string.substr(endIndex);
      return returnValue;
    };
    var stringEncaseCRLFWithFirstIndex = (string, prefix, postfix, index) => {
      let endIndex = 0;
      let returnValue = "";
      do {
        const gotCR = string[index - 1] === "\r";
        returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
        endIndex = index + 1;
        index = string.indexOf("\n", endIndex);
      } while (index !== -1);
      returnValue += string.substr(endIndex);
      return returnValue;
    };
    module2.exports = {
      stringReplaceAll,
      stringEncaseCRLFWithFirstIndex
    };
  }
});

// node_modules/chalk/source/templates.js
var require_templates = __commonJS({
  "node_modules/chalk/source/templates.js"(exports2, module2) {
    "use strict";
    var TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
    var STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
    var STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
    var ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi;
    var ESCAPES = /* @__PURE__ */ new Map([
      ["n", "\n"],
      ["r", "\r"],
      ["t", "	"],
      ["b", "\b"],
      ["f", "\f"],
      ["v", "\v"],
      ["0", "\0"],
      ["\\", "\\"],
      ["e", "\x1B"],
      ["a", "\x07"]
    ]);
    function unescape(c) {
      const u = c[0] === "u";
      const bracket = c[1] === "{";
      if (u && !bracket && c.length === 5 || c[0] === "x" && c.length === 3) {
        return String.fromCharCode(parseInt(c.slice(1), 16));
      }
      if (u && bracket) {
        return String.fromCodePoint(parseInt(c.slice(2, -1), 16));
      }
      return ESCAPES.get(c) || c;
    }
    function parseArguments(name, arguments_) {
      const results = [];
      const chunks = arguments_.trim().split(/\s*,\s*/g);
      let matches;
      for (const chunk of chunks) {
        const number = Number(chunk);
        if (!Number.isNaN(number)) {
          results.push(number);
        } else if (matches = chunk.match(STRING_REGEX)) {
          results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, character) => escape ? unescape(escape) : character));
        } else {
          throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
        }
      }
      return results;
    }
    function parseStyle(style) {
      STYLE_REGEX.lastIndex = 0;
      const results = [];
      let matches;
      while ((matches = STYLE_REGEX.exec(style)) !== null) {
        const name = matches[1];
        if (matches[2]) {
          const args = parseArguments(name, matches[2]);
          results.push([name].concat(args));
        } else {
          results.push([name]);
        }
      }
      return results;
    }
    function buildStyle(chalk, styles) {
      const enabled = {};
      for (const layer of styles) {
        for (const style of layer.styles) {
          enabled[style[0]] = layer.inverse ? null : style.slice(1);
        }
      }
      let current = chalk;
      for (const [styleName, styles2] of Object.entries(enabled)) {
        if (!Array.isArray(styles2)) {
          continue;
        }
        if (!(styleName in current)) {
          throw new Error(`Unknown Chalk style: ${styleName}`);
        }
        current = styles2.length > 0 ? current[styleName](...styles2) : current[styleName];
      }
      return current;
    }
    module2.exports = (chalk, temporary) => {
      const styles = [];
      const chunks = [];
      let chunk = [];
      temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style, close, character) => {
        if (escapeCharacter) {
          chunk.push(unescape(escapeCharacter));
        } else if (style) {
          const string = chunk.join("");
          chunk = [];
          chunks.push(styles.length === 0 ? string : buildStyle(chalk, styles)(string));
          styles.push({ inverse, styles: parseStyle(style) });
        } else if (close) {
          if (styles.length === 0) {
            throw new Error("Found extraneous } in Chalk template literal");
          }
          chunks.push(buildStyle(chalk, styles)(chunk.join("")));
          chunk = [];
          styles.pop();
        } else {
          chunk.push(character);
        }
      });
      chunks.push(chunk.join(""));
      if (styles.length > 0) {
        const errMessage = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? "" : "s"} (\`}\`)`;
        throw new Error(errMessage);
      }
      return chunks.join("");
    };
  }
});

// node_modules/chalk/source/index.js
var require_source = __commonJS({
  "node_modules/chalk/source/index.js"(exports2, module2) {
    "use strict";
    var ansiStyles = require_ansi_styles();
    var { stdout: stdoutColor, stderr: stderrColor } = require_supports_color2();
    var {
      stringReplaceAll,
      stringEncaseCRLFWithFirstIndex
    } = require_util();
    var { isArray } = Array;
    var levelMapping = [
      "ansi",
      "ansi",
      "ansi256",
      "ansi16m"
    ];
    var styles = /* @__PURE__ */ Object.create(null);
    var applyOptions = (object, options = {}) => {
      if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
        throw new Error("The `level` option should be an integer from 0 to 3");
      }
      const colorLevel = stdoutColor ? stdoutColor.level : 0;
      object.level = options.level === void 0 ? colorLevel : options.level;
    };
    var ChalkClass = class {
      constructor(options) {
        return chalkFactory(options);
      }
    };
    var chalkFactory = (options) => {
      const chalk2 = {};
      applyOptions(chalk2, options);
      chalk2.template = (...arguments_) => chalkTag(chalk2.template, ...arguments_);
      Object.setPrototypeOf(chalk2, Chalk.prototype);
      Object.setPrototypeOf(chalk2.template, chalk2);
      chalk2.template.constructor = () => {
        throw new Error("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.");
      };
      chalk2.template.Instance = ChalkClass;
      return chalk2.template;
    };
    function Chalk(options) {
      return chalkFactory(options);
    }
    for (const [styleName, style] of Object.entries(ansiStyles)) {
      styles[styleName] = {
        get() {
          const builder = createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty);
          Object.defineProperty(this, styleName, { value: builder });
          return builder;
        }
      };
    }
    styles.visible = {
      get() {
        const builder = createBuilder(this, this._styler, true);
        Object.defineProperty(this, "visible", { value: builder });
        return builder;
      }
    };
    var usedModels = ["rgb", "hex", "keyword", "hsl", "hsv", "hwb", "ansi", "ansi256"];
    for (const model of usedModels) {
      styles[model] = {
        get() {
          const { level } = this;
          return function(...arguments_) {
            const styler = createStyler(ansiStyles.color[levelMapping[level]][model](...arguments_), ansiStyles.color.close, this._styler);
            return createBuilder(this, styler, this._isEmpty);
          };
        }
      };
    }
    for (const model of usedModels) {
      const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
      styles[bgModel] = {
        get() {
          const { level } = this;
          return function(...arguments_) {
            const styler = createStyler(ansiStyles.bgColor[levelMapping[level]][model](...arguments_), ansiStyles.bgColor.close, this._styler);
            return createBuilder(this, styler, this._isEmpty);
          };
        }
      };
    }
    var proto = Object.defineProperties(() => {
    }, {
      ...styles,
      level: {
        enumerable: true,
        get() {
          return this._generator.level;
        },
        set(level) {
          this._generator.level = level;
        }
      }
    });
    var createStyler = (open, close, parent) => {
      let openAll;
      let closeAll;
      if (parent === void 0) {
        openAll = open;
        closeAll = close;
      } else {
        openAll = parent.openAll + open;
        closeAll = close + parent.closeAll;
      }
      return {
        open,
        close,
        openAll,
        closeAll,
        parent
      };
    };
    var createBuilder = (self2, _styler, _isEmpty) => {
      const builder = (...arguments_) => {
        if (isArray(arguments_[0]) && isArray(arguments_[0].raw)) {
          return applyStyle(builder, chalkTag(builder, ...arguments_));
        }
        return applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
      };
      Object.setPrototypeOf(builder, proto);
      builder._generator = self2;
      builder._styler = _styler;
      builder._isEmpty = _isEmpty;
      return builder;
    };
    var applyStyle = (self2, string) => {
      if (self2.level <= 0 || !string) {
        return self2._isEmpty ? "" : string;
      }
      let styler = self2._styler;
      if (styler === void 0) {
        return string;
      }
      const { openAll, closeAll } = styler;
      if (string.indexOf("\x1B") !== -1) {
        while (styler !== void 0) {
          string = stringReplaceAll(string, styler.close, styler.open);
          styler = styler.parent;
        }
      }
      const lfIndex = string.indexOf("\n");
      if (lfIndex !== -1) {
        string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
      }
      return openAll + string + closeAll;
    };
    var template;
    var chalkTag = (chalk2, ...strings) => {
      const [firstString] = strings;
      if (!isArray(firstString) || !isArray(firstString.raw)) {
        return strings.join(" ");
      }
      const arguments_ = strings.slice(1);
      const parts = [firstString.raw[0]];
      for (let i = 1; i < firstString.length; i++) {
        parts.push(
          String(arguments_[i - 1]).replace(/[{}\\]/g, "\\$&"),
          String(firstString.raw[i])
        );
      }
      if (template === void 0) {
        template = require_templates();
      }
      return template(chalk2, parts.join(""));
    };
    Object.defineProperties(Chalk.prototype, styles);
    var chalk = Chalk();
    chalk.supportsColor = stdoutColor;
    chalk.stderr = Chalk({ level: stderrColor ? stderrColor.level : 0 });
    chalk.stderr.supportsColor = stderrColor;
    module2.exports = chalk;
  }
});

// node_modules/mocha/node_modules/is-unicode-supported/index.js
var require_is_unicode_supported = __commonJS({
  "node_modules/mocha/node_modules/is-unicode-supported/index.js"(exports2, module2) {
    "use strict";
    module2.exports = () => {
      if (process.platform !== "win32") {
        return true;
      }
      return Boolean(process.env.CI) || Boolean(process.env.WT_SESSION) || // Windows Terminal
      process.env.TERM_PROGRAM === "vscode" || process.env.TERM === "xterm-256color" || process.env.TERM === "alacritty";
    };
  }
});

// node_modules/mocha/node_modules/log-symbols/index.js
var require_log_symbols = __commonJS({
  "node_modules/mocha/node_modules/log-symbols/index.js"(exports2, module2) {
    "use strict";
    var chalk = require_source();
    var isUnicodeSupported = require_is_unicode_supported();
    var main = {
      info: chalk.blue("\u2139"),
      success: chalk.green("\u2714"),
      warning: chalk.yellow("\u26A0"),
      error: chalk.red("\u2716")
    };
    var fallback = {
      info: chalk.blue("i"),
      success: chalk.green("\u221A"),
      warning: chalk.yellow("\u203C"),
      error: chalk.red("\xD7")
    };
    module2.exports = isUnicodeSupported() ? main : fallback;
  }
});

// node_modules/mocha/lib/pending.js
var require_pending = __commonJS({
  "node_modules/mocha/lib/pending.js"(exports2, module2) {
    "use strict";
    module2.exports = Pending;
    function Pending(message) {
      this.message = message;
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports2, module2) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self2 = debug;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
        for (const ns of split) {
          if (ns[0] === "-") {
            createDebug.skips.push(ns.slice(1));
          } else {
            createDebug.names.push(ns);
          }
        }
      }
      function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while (searchIndex < search.length) {
          if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
            if (template[templateIndex] === "*") {
              starIndex = templateIndex;
              matchIndex = searchIndex;
              templateIndex++;
            } else {
              searchIndex++;
              templateIndex++;
            }
          } else if (starIndex !== -1) {
            templateIndex = starIndex + 1;
            matchIndex++;
            searchIndex = matchIndex;
          } else {
            return false;
          }
        }
        while (templateIndex < template.length && template[templateIndex] === "*") {
          templateIndex++;
        }
        return templateIndex === template.length;
      }
      function disable() {
        const namespaces = [
          ...createDebug.names,
          ...createDebug.skips.map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        for (const skip of createDebug.skips) {
          if (matchesTemplate(name, skip)) {
            return false;
          }
        }
        for (const ns of createDebug.names) {
          if (matchesTemplate(name, ns)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports2, module2) {
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.storage = localstorage();
    exports2.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports2.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports2.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports2.storage.setItem("debug", namespaces);
        } else {
          exports2.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports2.storage.getItem("debug") || exports2.storage.getItem("DEBUG");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports2, module2) {
    var tty = require("tty");
    var util = require("util");
    exports2.init = init;
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.destroy = util.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports2.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require_supports_color2();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports2.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports2.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports2.inspectOpts ? Boolean(exports2.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports2.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.formatWithOptions(exports2.inspectOpts, ...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug) {
      debug.inspectOpts = {};
      const keys = Object.keys(exports2.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/debug/src/index.js"(exports2, module2) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// node_modules/mocha/lib/error-constants.js
var require_error_constants = __commonJS({
  "node_modules/mocha/lib/error-constants.js"(exports2, module2) {
    "use strict";
    var constants = {
      /**
       * An unrecoverable error.
       * @constant
       * @default
       */
      FATAL: "ERR_MOCHA_FATAL",
      /**
       * The type of an argument to a function call is invalid
       * @constant
       * @default
       */
      INVALID_ARG_TYPE: "ERR_MOCHA_INVALID_ARG_TYPE",
      /**
       * The value of an argument to a function call is invalid
       * @constant
       * @default
       */
      INVALID_ARG_VALUE: "ERR_MOCHA_INVALID_ARG_VALUE",
      /**
       * Something was thrown, but it wasn't an `Error`
       * @constant
       * @default
       */
      INVALID_EXCEPTION: "ERR_MOCHA_INVALID_EXCEPTION",
      /**
       * An interface (e.g., `Mocha.interfaces`) is unknown or invalid
       * @constant
       * @default
       */
      INVALID_INTERFACE: "ERR_MOCHA_INVALID_INTERFACE",
      /**
       * A reporter (.e.g, `Mocha.reporters`) is unknown or invalid
       * @constant
       * @default
       */
      INVALID_REPORTER: "ERR_MOCHA_INVALID_REPORTER",
      /**
       * `done()` was called twice in a `Test` or `Hook` callback
       * @constant
       * @default
       */
      MULTIPLE_DONE: "ERR_MOCHA_MULTIPLE_DONE",
      /**
       * No files matched the pattern provided by the user
       * @constant
       * @default
       */
      NO_FILES_MATCH_PATTERN: "ERR_MOCHA_NO_FILES_MATCH_PATTERN",
      /**
       * Known, but unsupported behavior of some kind
       * @constant
       * @default
       */
      UNSUPPORTED: "ERR_MOCHA_UNSUPPORTED",
      /**
       * Invalid state transition occurring in `Mocha` instance
       * @constant
       * @default
       */
      INSTANCE_ALREADY_RUNNING: "ERR_MOCHA_INSTANCE_ALREADY_RUNNING",
      /**
       * Invalid state transition occurring in `Mocha` instance
       * @constant
       * @default
       */
      INSTANCE_ALREADY_DISPOSED: "ERR_MOCHA_INSTANCE_ALREADY_DISPOSED",
      /**
       * Use of `only()` w/ `--forbid-only` results in this error.
       * @constant
       * @default
       */
      FORBIDDEN_EXCLUSIVITY: "ERR_MOCHA_FORBIDDEN_EXCLUSIVITY",
      /**
       * To be thrown when a user-defined plugin implementation (e.g., `mochaHooks`) is invalid
       * @constant
       * @default
       */
      INVALID_PLUGIN_IMPLEMENTATION: "ERR_MOCHA_INVALID_PLUGIN_IMPLEMENTATION",
      /**
       * To be thrown when a builtin or third-party plugin definition (the _definition_ of `mochaHooks`) is invalid
       * @constant
       * @default
       */
      INVALID_PLUGIN_DEFINITION: "ERR_MOCHA_INVALID_PLUGIN_DEFINITION",
      /**
       * When a runnable exceeds its allowed run time.
       * @constant
       * @default
       */
      TIMEOUT: "ERR_MOCHA_TIMEOUT",
      /**
       * Input file is not able to be parsed
       * @constant
       * @default
       */
      UNPARSABLE_FILE: "ERR_MOCHA_UNPARSABLE_FILE"
    };
    module2.exports = { constants };
  }
});

// node_modules/mocha/lib/errors.js
var require_errors = __commonJS({
  "node_modules/mocha/lib/errors.js"(exports2, module2) {
    "use strict";
    var { format } = require("node:util");
    var { constants } = require_error_constants();
    var emitWarning = (msg, type) => {
      if (process.emitWarning) {
        process.emitWarning(msg, type);
      } else {
        process.nextTick(function() {
          console.warn(type + ": " + msg);
        });
      }
    };
    var deprecate = (msg) => {
      msg = String(msg);
      if (msg && !deprecate.cache[msg]) {
        deprecate.cache[msg] = true;
        emitWarning(msg, "DeprecationWarning");
      }
    };
    deprecate.cache = {};
    var warn = (msg) => {
      if (msg) {
        emitWarning(msg);
      }
    };
    var MOCHA_ERRORS = new Set(Object.values(constants));
    function createNoFilesMatchPatternError(message, pattern) {
      var err = new Error(message);
      err.code = constants.NO_FILES_MATCH_PATTERN;
      err.pattern = pattern;
      return err;
    }
    function createInvalidReporterError(message, reporter) {
      var err = new TypeError(message);
      err.code = constants.INVALID_REPORTER;
      err.reporter = reporter;
      return err;
    }
    function createInvalidInterfaceError(message, ui) {
      var err = new Error(message);
      err.code = constants.INVALID_INTERFACE;
      err.interface = ui;
      return err;
    }
    function createUnsupportedError(message) {
      var err = new Error(message);
      err.code = constants.UNSUPPORTED;
      return err;
    }
    function createMissingArgumentError(message, argument, expected) {
      return createInvalidArgumentTypeError(message, argument, expected);
    }
    function createInvalidArgumentTypeError(message, argument, expected) {
      var err = new TypeError(message);
      err.code = constants.INVALID_ARG_TYPE;
      err.argument = argument;
      err.expected = expected;
      err.actual = typeof argument;
      return err;
    }
    function createInvalidArgumentValueError(message, argument, value, reason) {
      var err = new TypeError(message);
      err.code = constants.INVALID_ARG_VALUE;
      err.argument = argument;
      err.value = value;
      err.reason = typeof reason !== "undefined" ? reason : "is invalid";
      return err;
    }
    function createInvalidExceptionError(message, value) {
      var err = new Error(message);
      err.code = constants.INVALID_EXCEPTION;
      err.valueType = typeof value;
      err.value = value;
      return err;
    }
    function createFatalError(message, value) {
      var err = new Error(message);
      err.code = constants.FATAL;
      err.valueType = typeof value;
      err.value = value;
      return err;
    }
    function createInvalidLegacyPluginError(message, pluginType, pluginId) {
      switch (pluginType) {
        case "reporter":
          return createInvalidReporterError(message, pluginId);
        case "ui":
          return createInvalidInterfaceError(message, pluginId);
        default:
          throw new Error('unknown pluginType "' + pluginType + '"');
      }
    }
    function createInvalidPluginError(...args) {
      deprecate("Use createInvalidLegacyPluginError() instead");
      return createInvalidLegacyPluginError(...args);
    }
    function createMochaInstanceAlreadyDisposedError(message, cleanReferencesAfterRun, instance) {
      var err = new Error(message);
      err.code = constants.INSTANCE_ALREADY_DISPOSED;
      err.cleanReferencesAfterRun = cleanReferencesAfterRun;
      err.instance = instance;
      return err;
    }
    function createMochaInstanceAlreadyRunningError(message, instance) {
      var err = new Error(message);
      err.code = constants.INSTANCE_ALREADY_RUNNING;
      err.instance = instance;
      return err;
    }
    function createMultipleDoneError(runnable, originalErr) {
      var title;
      try {
        title = format("<%s>", runnable.fullTitle());
        if (runnable.parent.root) {
          title += " (of root suite)";
        }
      } catch (ignored) {
        title = format("<%s> (of unknown suite)", runnable.title);
      }
      var message = format(
        "done() called multiple times in %s %s",
        runnable.type ? runnable.type : "unknown runnable",
        title
      );
      if (runnable.file) {
        message += format(" of file %s", runnable.file);
      }
      if (originalErr) {
        message += format("; in addition, done() received error: %s", originalErr);
      }
      var err = new Error(message);
      err.code = constants.MULTIPLE_DONE;
      err.valueType = typeof originalErr;
      err.value = originalErr;
      return err;
    }
    function createForbiddenExclusivityError(mocha) {
      var err = new Error(
        mocha.isWorker ? "`.only` is not supported in parallel mode" : "`.only` forbidden by --forbid-only"
      );
      err.code = constants.FORBIDDEN_EXCLUSIVITY;
      return err;
    }
    function createInvalidPluginDefinitionError(msg, pluginDef) {
      const err = new Error(msg);
      err.code = constants.INVALID_PLUGIN_DEFINITION;
      err.pluginDef = pluginDef;
      return err;
    }
    function createInvalidPluginImplementationError(msg, { pluginDef, pluginImpl } = {}) {
      const err = new Error(msg);
      err.code = constants.INVALID_PLUGIN_IMPLEMENTATION;
      err.pluginDef = pluginDef;
      err.pluginImpl = pluginImpl;
      return err;
    }
    function createTimeoutError(msg, timeout, file) {
      const err = new Error(msg);
      err.code = constants.TIMEOUT;
      err.timeout = timeout;
      err.file = file;
      return err;
    }
    function createUnparsableFileError(message) {
      var err = new Error(message);
      err.code = constants.UNPARSABLE_FILE;
      return err;
    }
    var isMochaError = (err) => Boolean(err && typeof err === "object" && MOCHA_ERRORS.has(err.code));
    module2.exports = {
      createFatalError,
      createForbiddenExclusivityError,
      createInvalidArgumentTypeError,
      createInvalidArgumentValueError,
      createInvalidExceptionError,
      createInvalidInterfaceError,
      createInvalidLegacyPluginError,
      createInvalidPluginDefinitionError,
      createInvalidPluginError,
      createInvalidPluginImplementationError,
      createInvalidReporterError,
      createMissingArgumentError,
      createMochaInstanceAlreadyDisposedError,
      createMochaInstanceAlreadyRunningError,
      createMultipleDoneError,
      createNoFilesMatchPatternError,
      createTimeoutError,
      createUnparsableFileError,
      createUnsupportedError,
      deprecate,
      isMochaError,
      warn
    };
  }
});

// node_modules/mocha/lib/runnable.js
var require_runnable = __commonJS({
  "node_modules/mocha/lib/runnable.js"(exports2, module2) {
    "use strict";
    var EventEmitter = require("node:events").EventEmitter;
    var Pending = require_pending();
    var debug = require_src()("mocha:runnable");
    var milliseconds = require_ms();
    var utils = require_utils();
    var {
      createInvalidExceptionError,
      createMultipleDoneError,
      createTimeoutError
    } = require_errors();
    var Date2 = global.Date;
    var setTimeout2 = global.setTimeout;
    var clearTimeout2 = global.clearTimeout;
    var toString = Object.prototype.toString;
    var MAX_TIMEOUT = Math.pow(2, 31) - 1;
    module2.exports = Runnable;
    function Runnable(title, fn) {
      this.title = title;
      this.fn = fn;
      this.body = (fn || "").toString();
      this.async = fn && fn.length;
      this.sync = !this.async;
      this._timeout = 2e3;
      this._slow = 75;
      this._retries = -1;
      utils.assignNewMochaID(this);
      Object.defineProperty(this, "id", {
        get() {
          return utils.getMochaID(this);
        }
      });
      this.reset();
    }
    utils.inherits(Runnable, EventEmitter);
    Runnable.prototype.reset = function() {
      this.timedOut = false;
      this._currentRetry = 0;
      this.pending = false;
      delete this.state;
      delete this.err;
    };
    Runnable.prototype.timeout = function(ms) {
      if (!arguments.length) {
        return this._timeout;
      }
      if (typeof ms === "string") {
        ms = milliseconds(ms);
      }
      var range = [0, MAX_TIMEOUT];
      ms = utils.clamp(ms, range);
      if (ms === range[0] || ms === range[1]) {
        this._timeout = 0;
      } else {
        this._timeout = ms;
      }
      debug("timeout %d", this._timeout);
      if (this.timer) {
        this.resetTimeout();
      }
      return this;
    };
    Runnable.prototype.slow = function(ms) {
      if (!arguments.length || typeof ms === "undefined") {
        return this._slow;
      }
      if (typeof ms === "string") {
        ms = milliseconds(ms);
      }
      debug("slow %d", ms);
      this._slow = ms;
      return this;
    };
    Runnable.prototype.skip = function() {
      this.pending = true;
      throw new Pending("sync skip; aborting execution");
    };
    Runnable.prototype.isPending = function() {
      return this.pending || this.parent && this.parent.isPending();
    };
    Runnable.prototype.isFailed = function() {
      return !this.isPending() && this.state === constants.STATE_FAILED;
    };
    Runnable.prototype.isPassed = function() {
      return !this.isPending() && this.state === constants.STATE_PASSED;
    };
    Runnable.prototype.retries = function(n) {
      if (!arguments.length) {
        return this._retries;
      }
      this._retries = n;
    };
    Runnable.prototype.currentRetry = function(n) {
      if (!arguments.length) {
        return this._currentRetry;
      }
      this._currentRetry = n;
    };
    Runnable.prototype.fullTitle = function() {
      return this.titlePath().join(" ");
    };
    Runnable.prototype.titlePath = function() {
      return this.parent.titlePath().concat([this.title]);
    };
    Runnable.prototype.clearTimeout = function() {
      clearTimeout2(this.timer);
    };
    Runnable.prototype.resetTimeout = function() {
      var self2 = this;
      var ms = this.timeout() || MAX_TIMEOUT;
      this.clearTimeout();
      this.timer = setTimeout2(function() {
        if (self2.timeout() === 0) {
          return;
        }
        self2.callback(self2._timeoutError(ms));
        self2.timedOut = true;
      }, ms);
    };
    Runnable.prototype.globals = function(globals) {
      if (!arguments.length) {
        return this._allowedGlobals;
      }
      this._allowedGlobals = globals;
    };
    Runnable.prototype.run = function(fn) {
      var self2 = this;
      var start = new Date2();
      var ctx = this.ctx;
      var finished;
      var errorWasHandled = false;
      if (this.isPending()) return fn();
      if (ctx && ctx.runnable) {
        ctx.runnable(this);
      }
      function multiple(err) {
        if (errorWasHandled) {
          return;
        }
        errorWasHandled = true;
        self2.emit("error", createMultipleDoneError(self2, err));
      }
      function done(err) {
        var ms = self2.timeout();
        if (self2.timedOut) {
          return;
        }
        if (finished) {
          return multiple(err);
        }
        self2.clearTimeout();
        self2.duration = new Date2() - start;
        finished = true;
        if (!err && self2.duration > ms && ms > 0) {
          err = self2._timeoutError(ms);
        }
        fn(err);
      }
      this.callback = done;
      if (this.fn && typeof this.fn.call !== "function") {
        done(
          new TypeError(
            "A runnable must be passed a function as its second argument."
          )
        );
        return;
      }
      if (this.async) {
        this.resetTimeout();
        this.skip = function asyncSkip() {
          this.pending = true;
          done();
          throw new Pending("async skip; aborting execution");
        };
        try {
          callFnAsync(this.fn);
        } catch (err) {
          errorWasHandled = true;
          if (err instanceof Pending) {
            return;
          } else if (this.allowUncaught) {
            throw err;
          }
          done(Runnable.toValueOrError(err));
        }
        return;
      }
      try {
        callFn(this.fn);
      } catch (err) {
        errorWasHandled = true;
        if (err instanceof Pending) {
          return done();
        } else if (this.allowUncaught) {
          throw err;
        }
        done(Runnable.toValueOrError(err));
      }
      function callFn(fn2) {
        var result = fn2.call(ctx);
        if (result && typeof result.then === "function") {
          self2.resetTimeout();
          result.then(
            function() {
              done();
              return null;
            },
            function(reason) {
              done(reason || new Error("Promise rejected with no or falsy reason"));
            }
          );
        } else {
          if (self2.asyncOnly) {
            return done(
              new Error(
                "--async-only option in use without declaring `done()` or returning a promise"
              )
            );
          }
          done();
        }
      }
      function callFnAsync(fn2) {
        var result = fn2.call(ctx, function(err) {
          if (err instanceof Error || toString.call(err) === "[object Error]") {
            return done(err);
          }
          if (err) {
            if (Object.prototype.toString.call(err) === "[object Object]") {
              return done(
                new Error("done() invoked with non-Error: " + JSON.stringify(err))
              );
            }
            return done(new Error("done() invoked with non-Error: " + err));
          }
          if (result && utils.isPromise(result)) {
            return done(
              new Error(
                "Resolution method is overspecified. Specify a callback *or* return a Promise; not both."
              )
            );
          }
          done();
        });
      }
    };
    Runnable.prototype._timeoutError = function(ms) {
      let msg = `Timeout of ${ms}ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.`;
      if (this.file) {
        msg += " (" + this.file + ")";
      }
      return createTimeoutError(msg, ms, this.file);
    };
    var constants = utils.defineConstants(
      /**
       * {@link Runnable}-related constants.
       * @public
       * @memberof Runnable
       * @readonly
       * @static
       * @alias constants
       * @enum {string}
       */
      {
        /**
         * Value of `state` prop when a `Runnable` has failed
         */
        STATE_FAILED: "failed",
        /**
         * Value of `state` prop when a `Runnable` has passed
         */
        STATE_PASSED: "passed",
        /**
         * Value of `state` prop when a `Runnable` has been skipped by user
         */
        STATE_PENDING: "pending"
      }
    );
    Runnable.toValueOrError = function(value) {
      return value || createInvalidExceptionError(
        "Runnable failed with falsy or undefined exception. Please throw an Error instead.",
        value
      );
    };
    Runnable.constants = constants;
  }
});

// node_modules/mocha/lib/hook.js
var require_hook = __commonJS({
  "node_modules/mocha/lib/hook.js"(exports2, module2) {
    "use strict";
    var Runnable = require_runnable();
    var { inherits, constants } = require_utils();
    var { MOCHA_ID_PROP_NAME } = constants;
    module2.exports = Hook;
    function Hook(title, fn) {
      Runnable.call(this, title, fn);
      this.type = "hook";
    }
    inherits(Hook, Runnable);
    Hook.prototype.reset = function() {
      Runnable.prototype.reset.call(this);
      delete this._error;
    };
    Hook.prototype.error = function(err) {
      if (!arguments.length) {
        err = this._error;
        this._error = null;
        return err;
      }
      this._error = err;
    };
    Hook.prototype.serialize = function serialize() {
      return {
        $$currentRetry: this.currentRetry(),
        $$fullTitle: this.fullTitle(),
        $$isPending: Boolean(this.isPending()),
        $$titlePath: this.titlePath(),
        ctx: this.ctx && this.ctx.currentTest ? {
          currentTest: {
            title: this.ctx.currentTest.title,
            [MOCHA_ID_PROP_NAME]: this.ctx.currentTest.id
          }
        } : {},
        duration: this.duration,
        file: this.file,
        parent: {
          $$fullTitle: this.parent.fullTitle(),
          [MOCHA_ID_PROP_NAME]: this.parent.id
        },
        state: this.state,
        title: this.title,
        type: this.type,
        [MOCHA_ID_PROP_NAME]: this.id
      };
    };
  }
});

// node_modules/mocha/lib/suite.js
var require_suite = __commonJS({
  "node_modules/mocha/lib/suite.js"(exports2, module2) {
    "use strict";
    var { EventEmitter } = require("node:events");
    var Hook = require_hook();
    var {
      assignNewMochaID,
      clamp,
      constants: utilsConstants,
      defineConstants,
      getMochaID,
      inherits,
      isString
    } = require_utils();
    var debug = require_src()("mocha:suite");
    var milliseconds = require_ms();
    var errors = require_errors();
    var { MOCHA_ID_PROP_NAME } = utilsConstants;
    exports2 = module2.exports = Suite;
    Suite.create = function(parent, title) {
      var suite = new Suite(title, parent.ctx);
      suite.parent = parent;
      title = suite.fullTitle();
      parent.addSuite(suite);
      return suite;
    };
    function Suite(title, parentContext, isRoot) {
      if (!isString(title)) {
        throw errors.createInvalidArgumentTypeError(
          'Suite argument "title" must be a string. Received type "' + typeof title + '"',
          "title",
          "string"
        );
      }
      this.title = title;
      function Context() {
      }
      Context.prototype = parentContext;
      this.ctx = new Context();
      this.suites = [];
      this.tests = [];
      this.root = isRoot === true;
      this.pending = false;
      this._retries = -1;
      this._beforeEach = [];
      this._beforeAll = [];
      this._afterEach = [];
      this._afterAll = [];
      this._timeout = 2e3;
      this._slow = 75;
      this._bail = false;
      this._onlyTests = [];
      this._onlySuites = [];
      assignNewMochaID(this);
      Object.defineProperty(this, "id", {
        get() {
          return getMochaID(this);
        }
      });
      this.reset();
    }
    inherits(Suite, EventEmitter);
    Suite.prototype.reset = function() {
      this.delayed = false;
      function doReset(thingToReset) {
        thingToReset.reset();
      }
      this.suites.forEach(doReset);
      this.tests.forEach(doReset);
      this._beforeEach.forEach(doReset);
      this._afterEach.forEach(doReset);
      this._beforeAll.forEach(doReset);
      this._afterAll.forEach(doReset);
    };
    Suite.prototype.clone = function() {
      var suite = new Suite(this.title);
      debug("clone");
      suite.ctx = this.ctx;
      suite.root = this.root;
      suite.timeout(this.timeout());
      suite.retries(this.retries());
      suite.slow(this.slow());
      suite.bail(this.bail());
      return suite;
    };
    Suite.prototype.timeout = function(ms) {
      if (!arguments.length) {
        return this._timeout;
      }
      if (typeof ms === "string") {
        ms = milliseconds(ms);
      }
      var INT_MAX = Math.pow(2, 31) - 1;
      var range = [0, INT_MAX];
      ms = clamp(ms, range);
      debug("timeout %d", ms);
      this._timeout = parseInt(ms, 10);
      for (const t of this.tests) {
        t.timeout(this._timeout);
      }
      for (const s of this.suites) {
        s.timeout(this._timeout);
      }
      return this;
    };
    Suite.prototype.retries = function(n) {
      if (!arguments.length) {
        return this._retries;
      }
      debug("retries %d", n);
      this._retries = parseInt(n, 10) || 0;
      return this;
    };
    Suite.prototype.slow = function(ms) {
      if (!arguments.length) {
        return this._slow;
      }
      if (typeof ms === "string") {
        ms = milliseconds(ms);
      }
      debug("slow %d", ms);
      this._slow = ms;
      return this;
    };
    Suite.prototype.bail = function(bail) {
      if (!arguments.length) {
        return this._bail;
      }
      debug("bail %s", bail);
      this._bail = bail;
      return this;
    };
    Suite.prototype.isPending = function() {
      return this.pending || this.parent && this.parent.isPending();
    };
    Suite.prototype._createHook = function(title, fn) {
      var hook = new Hook(title, fn);
      hook.parent = this;
      hook.timeout(this.timeout());
      hook.retries(this.retries());
      hook.slow(this.slow());
      hook.ctx = this.ctx;
      hook.file = this.file;
      return hook;
    };
    Suite.prototype.beforeAll = function(title, fn) {
      if (this.isPending()) {
        return this;
      }
      if (typeof title === "function") {
        fn = title;
        title = fn.name;
      }
      title = '"before all" hook' + (title ? ": " + title : "");
      var hook = this._createHook(title, fn);
      this._beforeAll.push(hook);
      this.emit(constants.EVENT_SUITE_ADD_HOOK_BEFORE_ALL, hook);
      return hook;
    };
    Suite.prototype.afterAll = function(title, fn) {
      if (this.isPending()) {
        return this;
      }
      if (typeof title === "function") {
        fn = title;
        title = fn.name;
      }
      title = '"after all" hook' + (title ? ": " + title : "");
      var hook = this._createHook(title, fn);
      this._afterAll.push(hook);
      this.emit(constants.EVENT_SUITE_ADD_HOOK_AFTER_ALL, hook);
      return hook;
    };
    Suite.prototype.beforeEach = function(title, fn) {
      if (this.isPending()) {
        return this;
      }
      if (typeof title === "function") {
        fn = title;
        title = fn.name;
      }
      title = '"before each" hook' + (title ? ": " + title : "");
      var hook = this._createHook(title, fn);
      this._beforeEach.push(hook);
      this.emit(constants.EVENT_SUITE_ADD_HOOK_BEFORE_EACH, hook);
      return hook;
    };
    Suite.prototype.afterEach = function(title, fn) {
      if (this.isPending()) {
        return this;
      }
      if (typeof title === "function") {
        fn = title;
        title = fn.name;
      }
      title = '"after each" hook' + (title ? ": " + title : "");
      var hook = this._createHook(title, fn);
      this._afterEach.push(hook);
      this.emit(constants.EVENT_SUITE_ADD_HOOK_AFTER_EACH, hook);
      return hook;
    };
    Suite.prototype.addSuite = function(suite) {
      suite.parent = this;
      suite.root = false;
      suite.timeout(this.timeout());
      suite.retries(this.retries());
      suite.slow(this.slow());
      suite.bail(this.bail());
      this.suites.push(suite);
      this.emit(constants.EVENT_SUITE_ADD_SUITE, suite);
      return this;
    };
    Suite.prototype.addTest = function(test) {
      test.parent = this;
      test.timeout(this.timeout());
      test.retries(this.retries());
      test.slow(this.slow());
      test.ctx = this.ctx;
      this.tests.push(test);
      this.emit(constants.EVENT_SUITE_ADD_TEST, test);
      return this;
    };
    Suite.prototype.fullTitle = function() {
      return this.titlePath().join(" ");
    };
    Suite.prototype.titlePath = function() {
      var result = [];
      if (this.parent) {
        result = result.concat(this.parent.titlePath());
      }
      if (!this.root) {
        result.push(this.title);
      }
      return result;
    };
    Suite.prototype.total = function() {
      return this.suites.reduce(function(sum, suite) {
        return sum + suite.total();
      }, 0) + this.tests.length;
    };
    Suite.prototype.eachTest = function(fn) {
      this.tests.forEach(fn);
      this.suites.forEach(function(suite) {
        suite.eachTest(fn);
      });
      return this;
    };
    Suite.prototype.run = function run2() {
      if (this.root) {
        this.emit(constants.EVENT_ROOT_SUITE_RUN);
      }
    };
    Suite.prototype.hasOnly = function hasOnly() {
      return this._onlyTests.length > 0 || this._onlySuites.length > 0 || this.suites.some(function(suite) {
        return suite.hasOnly();
      });
    };
    Suite.prototype.filterOnly = function filterOnly() {
      if (this._onlyTests.length) {
        this.tests = this._onlyTests;
        this.suites = [];
      } else {
        this.tests = [];
        this._onlySuites.forEach(function(onlySuite) {
          if (onlySuite.hasOnly()) {
            onlySuite.filterOnly();
          }
        });
        var onlySuites = this._onlySuites;
        this.suites = this.suites.filter(function(childSuite) {
          return onlySuites.indexOf(childSuite) !== -1 || childSuite.filterOnly();
        });
      }
      return this.tests.length > 0 || this.suites.length > 0;
    };
    Suite.prototype.appendOnlySuite = function(suite) {
      this._onlySuites.push(suite);
    };
    Suite.prototype.markOnly = function() {
      this.parent && this.parent.appendOnlySuite(this);
    };
    Suite.prototype.appendOnlyTest = function(test) {
      this._onlyTests.push(test);
    };
    Suite.prototype.getHooks = function getHooks(name) {
      return this["_" + name];
    };
    Suite.prototype.dispose = function() {
      this.suites.forEach(function(suite) {
        suite.dispose();
      });
      this.cleanReferences();
    };
    Suite.prototype.cleanReferences = function cleanReferences() {
      function cleanArrReferences(arr) {
        for (var i2 = 0; i2 < arr.length; i2++) {
          delete arr[i2].fn;
        }
      }
      if (Array.isArray(this._beforeAll)) {
        cleanArrReferences(this._beforeAll);
      }
      if (Array.isArray(this._beforeEach)) {
        cleanArrReferences(this._beforeEach);
      }
      if (Array.isArray(this._afterAll)) {
        cleanArrReferences(this._afterAll);
      }
      if (Array.isArray(this._afterEach)) {
        cleanArrReferences(this._afterEach);
      }
      for (var i = 0; i < this.tests.length; i++) {
        delete this.tests[i].fn;
      }
    };
    Suite.prototype.serialize = function serialize() {
      return {
        _bail: this._bail,
        $$fullTitle: this.fullTitle(),
        $$isPending: Boolean(this.isPending()),
        root: this.root,
        title: this.title,
        [MOCHA_ID_PROP_NAME]: this.id,
        parent: this.parent ? { [MOCHA_ID_PROP_NAME]: this.parent.id } : null
      };
    };
    var constants = defineConstants(
      /**
       * {@link Suite}-related constants.
       * @public
       * @memberof Suite
       * @alias constants
       * @readonly
       * @static
       * @enum {string}
       */
      {
        /**
         * Event emitted after a test file has been loaded. Not emitted in browser.
         */
        EVENT_FILE_POST_REQUIRE: "post-require",
        /**
         * Event emitted before a test file has been loaded. In browser, this is emitted once an interface has been selected.
         */
        EVENT_FILE_PRE_REQUIRE: "pre-require",
        /**
         * Event emitted immediately after a test file has been loaded. Not emitted in browser.
         */
        EVENT_FILE_REQUIRE: "require",
        /**
         * Event emitted when `global.run()` is called (use with `delay` option).
         */
        EVENT_ROOT_SUITE_RUN: "run",
        /**
         * Namespace for collection of a `Suite`'s "after all" hooks.
         */
        HOOK_TYPE_AFTER_ALL: "afterAll",
        /**
         * Namespace for collection of a `Suite`'s "after each" hooks.
         */
        HOOK_TYPE_AFTER_EACH: "afterEach",
        /**
         * Namespace for collection of a `Suite`'s "before all" hooks.
         */
        HOOK_TYPE_BEFORE_ALL: "beforeAll",
        /**
         * Namespace for collection of a `Suite`'s "before each" hooks.
         */
        HOOK_TYPE_BEFORE_EACH: "beforeEach",
        /**
         * Emitted after a child `Suite` has been added to a `Suite`.
         */
        EVENT_SUITE_ADD_SUITE: "suite",
        /**
         * Emitted after an "after all" `Hook` has been added to a `Suite`.
         */
        EVENT_SUITE_ADD_HOOK_AFTER_ALL: "afterAll",
        /**
         * Emitted after an "after each" `Hook` has been added to a `Suite`.
         */
        EVENT_SUITE_ADD_HOOK_AFTER_EACH: "afterEach",
        /**
         * Emitted after an "before all" `Hook` has been added to a `Suite`.
         */
        EVENT_SUITE_ADD_HOOK_BEFORE_ALL: "beforeAll",
        /**
         * Emitted after an "before each" `Hook` has been added to a `Suite`.
         */
        EVENT_SUITE_ADD_HOOK_BEFORE_EACH: "beforeEach",
        /**
         * Emitted after a `Test` has been added to a `Suite`.
         */
        EVENT_SUITE_ADD_TEST: "test"
      }
    );
    Suite.constants = constants;
  }
});

// node_modules/mocha/lib/runner.js
var require_runner = __commonJS({
  "node_modules/mocha/lib/runner.js"(exports2, module2) {
    "use strict";
    var EventEmitter = require("node:events").EventEmitter;
    var Pending = require_pending();
    var utils = require_utils();
    var debug = require_src()("mocha:runner");
    var Runnable = require_runnable();
    var Suite = require_suite();
    var HOOK_TYPE_BEFORE_EACH = Suite.constants.HOOK_TYPE_BEFORE_EACH;
    var HOOK_TYPE_AFTER_EACH = Suite.constants.HOOK_TYPE_AFTER_EACH;
    var HOOK_TYPE_AFTER_ALL = Suite.constants.HOOK_TYPE_AFTER_ALL;
    var HOOK_TYPE_BEFORE_ALL = Suite.constants.HOOK_TYPE_BEFORE_ALL;
    var EVENT_ROOT_SUITE_RUN = Suite.constants.EVENT_ROOT_SUITE_RUN;
    var STATE_FAILED = Runnable.constants.STATE_FAILED;
    var STATE_PASSED = Runnable.constants.STATE_PASSED;
    var STATE_PENDING = Runnable.constants.STATE_PENDING;
    var stackFilter = utils.stackTraceFilter();
    var stringify = utils.stringify;
    var {
      createInvalidExceptionError,
      createUnsupportedError,
      createFatalError,
      isMochaError
    } = require_errors();
    var { constants: errorConstants } = require_error_constants();
    var globals = [
      "setTimeout",
      "clearTimeout",
      "setInterval",
      "clearInterval",
      "XMLHttpRequest",
      "Date",
      "setImmediate",
      "clearImmediate"
    ];
    var constants = utils.defineConstants(
      /**
       * {@link Runner}-related constants. Used by reporters. Each event emits the corresponding object, unless otherwise indicated.
       * @example
       * const Mocha = require('mocha');
       * const Base = Mocha.reporters.Base;
       * const {
       *   EVENT_HOOK_BEGIN,
       *   EVENT_TEST_PASS,
       *   EVENT_TEST_FAIL,
       *   EVENT_TEST_END
       * } = Mocha.Runner.constants
       *
       * function MyReporter(runner, options) {
       *   Base.call(this, runner, options);
       *
       *   runner.on(EVENT_HOOK_BEGIN, function(hook) {
       *     console.log('hook called: ', hook.title);
       *   });
       *
       *   runner.on(EVENT_TEST_PASS, function(test) {
       *     console.log('pass: %s', test.fullTitle());
       *   });
       *
       *   runner.on(EVENT_TEST_FAIL, function(test, err) {
       *     console.log('fail: %s -- error: %s', test.fullTitle(), err.message);
       *   });
       *
       *   runner.on(EVENT_TEST_END, function() {
       *     console.log('end: %d/%d', runner.stats.passes, runner.stats.tests);
       *   });
       * }
       *
       * module.exports = MyReporter;
       *
       * @public
       * @memberof Runner
       * @readonly
       * @alias constants
       * @static
       * @enum {string}
       */
      {
        /**
         * Emitted when {@link Hook} execution begins
         */
        EVENT_HOOK_BEGIN: "hook",
        /**
         * Emitted when {@link Hook} execution ends
         */
        EVENT_HOOK_END: "hook end",
        /**
         * Emitted when Root {@link Suite} execution begins (all files have been parsed and hooks/tests are ready for execution)
         */
        EVENT_RUN_BEGIN: "start",
        /**
         * Emitted when Root {@link Suite} execution has been delayed via `delay` option
         */
        EVENT_DELAY_BEGIN: "waiting",
        /**
         * Emitted when delayed Root {@link Suite} execution is triggered by user via `global.run()`
         */
        EVENT_DELAY_END: "ready",
        /**
         * Emitted when Root {@link Suite} execution ends
         */
        EVENT_RUN_END: "end",
        /**
         * Emitted when {@link Suite} execution begins
         */
        EVENT_SUITE_BEGIN: "suite",
        /**
         * Emitted when {@link Suite} execution ends
         */
        EVENT_SUITE_END: "suite end",
        /**
         * Emitted when {@link Test} execution begins
         */
        EVENT_TEST_BEGIN: "test",
        /**
         * Emitted when {@link Test} execution ends
         */
        EVENT_TEST_END: "test end",
        /**
         * Emitted when {@link Test} execution fails. Includes an `err` object of type `Error`.
         * @example
         * runner.on(EVENT_TEST_FAIL, function(test, err) {
         *   console.log('fail: %s -- error: %s', test.fullTitle(), err.message);
         * });
         *
         *
         */
        EVENT_TEST_FAIL: "fail",
        /**
         * Emitted when {@link Test} execution succeeds
         */
        EVENT_TEST_PASS: "pass",
        /**
         * Emitted when {@link Test} becomes pending
         */
        EVENT_TEST_PENDING: "pending",
        /**
         * Emitted when {@link Test} execution has failed, but will retry
         */
        EVENT_TEST_RETRY: "retry",
        /**
         * Initial state of Runner
         */
        STATE_IDLE: "idle",
        /**
         * State set to this value when the Runner has started running
         */
        STATE_RUNNING: "running",
        /**
         * State set to this value when the Runner has stopped
         */
        STATE_STOPPED: "stopped"
      }
    );
    var Runner = class extends EventEmitter {
      /**
       * Initialize a `Runner` at the Root {@link Suite}, which represents a hierarchy of {@link Suite|Suites} and {@link Test|Tests}.
       *
       * @extends external:EventEmitter
       * @public
       * @class
       * @param {Suite} suite - Root suite
       * @param {Object} [opts] - Settings object
       * @param {boolean} [opts.cleanReferencesAfterRun] - Whether to clean references to test fns and hooks when a suite is done.
       * @param {boolean} [opts.delay] - Whether to delay execution of root suite until ready.
       * @param {boolean} [opts.dryRun] - Whether to report tests without running them.
       * @param {boolean} [opts.failZero] - Whether to fail test run if zero tests encountered.
       */
      constructor(suite, opts = {}) {
        super();
        var self2 = this;
        this._globals = [];
        this._abort = false;
        this.suite = suite;
        this._opts = opts;
        this.state = constants.STATE_IDLE;
        this.total = suite.total();
        this.failures = 0;
        this._eventListeners = /* @__PURE__ */ new Map();
        this.on(constants.EVENT_TEST_END, function(test) {
          if (test.type === "test" && test.retriedTest() && test.parent) {
            var idx = test.parent.tests && test.parent.tests.indexOf(test.retriedTest());
            if (idx > -1) test.parent.tests[idx] = test;
          }
          self2.checkGlobals(test);
        });
        this.on(constants.EVENT_HOOK_END, function(hook) {
          self2.checkGlobals(hook);
        });
        this._defaultGrep = /.*/;
        this.grep(this._defaultGrep);
        this.globals(this.globalProps());
        this.uncaught = this._uncaught.bind(this);
        this.unhandled = (reason, promise) => {
          if (isMochaError(reason)) {
            debug(
              "trapped unhandled rejection coming out of Mocha; forwarding to uncaught handler:",
              reason
            );
            this.uncaught(reason);
          } else {
            debug(
              "trapped unhandled rejection from (probably) user code; re-emitting on process"
            );
            this._removeEventListener(
              process,
              "unhandledRejection",
              this.unhandled
            );
            try {
              process.emit("unhandledRejection", reason, promise);
            } finally {
              this._addEventListener(process, "unhandledRejection", this.unhandled);
            }
          }
        };
      }
    };
    Runner.immediately = global.setImmediate || process.nextTick;
    Runner.prototype._addEventListener = function(target, eventName, listener) {
      debug(
        "_addEventListener(): adding for event %s; %d current listeners",
        eventName,
        target.listenerCount(eventName)
      );
      if (this._eventListeners.has(target) && this._eventListeners.get(target).has(eventName) && this._eventListeners.get(target).get(eventName).has(listener)) {
        debug(
          "warning: tried to attach duplicate event listener for %s",
          eventName
        );
        return;
      }
      target.on(eventName, listener);
      const targetListeners = this._eventListeners.has(target) ? this._eventListeners.get(target) : /* @__PURE__ */ new Map();
      const targetEventListeners = targetListeners.has(eventName) ? targetListeners.get(eventName) : /* @__PURE__ */ new Set();
      targetEventListeners.add(listener);
      targetListeners.set(eventName, targetEventListeners);
      this._eventListeners.set(target, targetListeners);
    };
    Runner.prototype._removeEventListener = function(target, eventName, listener) {
      target.removeListener(eventName, listener);
      if (this._eventListeners.has(target)) {
        const targetListeners = this._eventListeners.get(target);
        if (targetListeners.has(eventName)) {
          const targetEventListeners = targetListeners.get(eventName);
          targetEventListeners.delete(listener);
          if (!targetEventListeners.size) {
            targetListeners.delete(eventName);
          }
        }
        if (!targetListeners.size) {
          this._eventListeners.delete(target);
        }
      } else {
        debug("trying to remove listener for untracked object %s", target);
      }
    };
    Runner.prototype.dispose = function() {
      this.removeAllListeners();
      this._eventListeners.forEach((targetListeners, target) => {
        targetListeners.forEach((targetEventListeners, eventName) => {
          targetEventListeners.forEach((listener) => {
            target.removeListener(eventName, listener);
          });
        });
      });
      this._eventListeners.clear();
    };
    Runner.prototype.grep = function(re, invert) {
      debug("grep(): setting to %s", re);
      this._grep = re;
      this._invert = invert;
      this.total = this.grepTotal(this.suite);
      return this;
    };
    Runner.prototype.grepTotal = function(suite) {
      var self2 = this;
      var total = 0;
      suite.eachTest(function(test) {
        var match = self2._grep.test(test.fullTitle());
        if (self2._invert) {
          match = !match;
        }
        if (match) {
          total++;
        }
      });
      return total;
    };
    Runner.prototype.globalProps = function() {
      var props = Object.keys(global);
      for (var i = 0; i < globals.length; ++i) {
        if (~props.indexOf(globals[i])) {
          continue;
        }
        props.push(globals[i]);
      }
      return props;
    };
    Runner.prototype.globals = function(arr) {
      if (!arguments.length) {
        return this._globals;
      }
      debug("globals(): setting to %O", arr);
      this._globals = this._globals.concat(arr);
      return this;
    };
    Runner.prototype.checkGlobals = function(test) {
      if (!this.checkLeaks) {
        return;
      }
      var ok = this._globals;
      var globals2 = this.globalProps();
      var leaks;
      if (test) {
        ok = ok.concat(test._allowedGlobals || []);
      }
      if (this.prevGlobalsLength === globals2.length) {
        return;
      }
      this.prevGlobalsLength = globals2.length;
      leaks = filterLeaks(ok, globals2);
      this._globals = this._globals.concat(leaks);
      if (leaks.length) {
        var msg = `global leak(s) detected: ${leaks.map((e) => `'${e}'`).join(", ")}`;
        this.fail(test, new Error(msg));
      }
    };
    Runner.prototype.fail = function(test, err, force) {
      force = force === true;
      if (test.isPending() && !force) {
        return;
      }
      if (this.state === constants.STATE_STOPPED) {
        if (err.code === errorConstants.MULTIPLE_DONE) {
          throw err;
        }
        throw createFatalError(
          "Test failed after root suite execution completed!",
          err
        );
      }
      ++this.failures;
      debug("total number of failures: %d", this.failures);
      test.state = STATE_FAILED;
      if (!isError(err)) {
        err = thrown2Error(err);
      }
      if (!this.fullStackTrace) {
        const alreadyFiltered = /* @__PURE__ */ new Set();
        let currentErr = err;
        while (currentErr && currentErr.stack && !alreadyFiltered.has(currentErr)) {
          alreadyFiltered.add(currentErr);
          try {
            currentErr.stack = stackFilter(currentErr.stack);
          } catch (ignore) {
          }
          currentErr = currentErr.cause;
        }
      }
      this.emit(constants.EVENT_TEST_FAIL, test, err);
    };
    Runner.prototype.hook = function(name, fn) {
      if (this._opts.dryRun) return fn();
      var suite = this.suite;
      var hooks = suite.getHooks(name);
      var self2 = this;
      function next(i) {
        var hook = hooks[i];
        if (!hook) {
          return fn();
        }
        self2.currentRunnable = hook;
        if (name === HOOK_TYPE_BEFORE_ALL) {
          hook.ctx.currentTest = hook.parent.tests[0];
        } else if (name === HOOK_TYPE_AFTER_ALL) {
          hook.ctx.currentTest = hook.parent.tests[hook.parent.tests.length - 1];
        } else {
          hook.ctx.currentTest = self2.test;
        }
        setHookTitle(hook);
        hook.allowUncaught = self2.allowUncaught;
        self2.emit(constants.EVENT_HOOK_BEGIN, hook);
        if (!hook.listeners("error").length) {
          self2._addEventListener(hook, "error", function(err) {
            self2.fail(hook, err);
          });
        }
        hook.run(function cbHookRun(err) {
          var testError = hook.error();
          if (testError) {
            self2.fail(self2.test, testError);
          }
          if (hook.pending) {
            if (name === HOOK_TYPE_AFTER_EACH) {
              if (self2.test) {
                self2.test.pending = true;
              }
            } else if (name === HOOK_TYPE_BEFORE_EACH) {
              if (self2.test) {
                self2.test.pending = true;
              }
              self2.emit(constants.EVENT_HOOK_END, hook);
              hook.pending = false;
              return fn(new Error("abort hookDown"));
            } else if (name === HOOK_TYPE_BEFORE_ALL) {
              suite.tests.forEach(function(test) {
                test.pending = true;
              });
              suite.suites.forEach(function(suite2) {
                suite2.pending = true;
              });
              hooks = [];
            } else {
              hook.pending = false;
              var errForbid = createUnsupportedError("`this.skip` forbidden");
              self2.fail(hook, errForbid);
              return fn(errForbid);
            }
          } else if (err) {
            self2.fail(hook, err);
            return fn(err);
          }
          self2.emit(constants.EVENT_HOOK_END, hook);
          delete hook.ctx.currentTest;
          setHookTitle(hook);
          next(++i);
        });
        function setHookTitle(hook2) {
          hook2.originalTitle = hook2.originalTitle || hook2.title;
          if (hook2.ctx && hook2.ctx.currentTest) {
            hook2.title = `${hook2.originalTitle} for "${hook2.ctx.currentTest.title}"`;
          } else {
            var parentTitle;
            if (hook2.parent.title) {
              parentTitle = hook2.parent.title;
            } else {
              parentTitle = hook2.parent.root ? "{root}" : "";
            }
            hook2.title = `${hook2.originalTitle} in "${parentTitle}"`;
          }
        }
      }
      Runner.immediately(function() {
        next(0);
      });
    };
    Runner.prototype.hooks = function(name, suites, fn) {
      var self2 = this;
      var orig = this.suite;
      function next(suite) {
        self2.suite = suite;
        if (!suite) {
          self2.suite = orig;
          return fn();
        }
        self2.hook(name, function(err) {
          if (err) {
            var errSuite = self2.suite;
            self2.suite = orig;
            return fn(err, errSuite);
          }
          next(suites.pop());
        });
      }
      next(suites.pop());
    };
    Runner.prototype.hookUp = function(name, fn) {
      var suites = [this.suite].concat(this.parents()).reverse();
      this.hooks(name, suites, fn);
    };
    Runner.prototype.hookDown = function(name, fn) {
      var suites = [this.suite].concat(this.parents());
      this.hooks(name, suites, fn);
    };
    Runner.prototype.parents = function() {
      var suite = this.suite;
      var suites = [];
      while (suite.parent) {
        suite = suite.parent;
        suites.push(suite);
      }
      return suites;
    };
    Runner.prototype.runTest = function(fn) {
      if (this._opts.dryRun) return Runner.immediately(fn);
      var self2 = this;
      var test = this.test;
      if (!test) {
        return;
      }
      if (this.asyncOnly) {
        test.asyncOnly = true;
      }
      this._addEventListener(test, "error", function(err) {
        self2.fail(test, err);
      });
      if (this.allowUncaught) {
        test.allowUncaught = true;
        return test.run(fn);
      }
      try {
        test.run(fn);
      } catch (err) {
        fn(err);
      }
    };
    Runner.prototype.runTests = function(suite, fn) {
      var self2 = this;
      var tests = suite.tests.slice();
      var test;
      function hookErr(_, errSuite, after) {
        var orig = self2.suite;
        self2.suite = after ? errSuite.parent : errSuite;
        if (self2.suite) {
          self2.hookUp(HOOK_TYPE_AFTER_EACH, function(err2, errSuite2) {
            self2.suite = orig;
            if (err2) {
              return hookErr(err2, errSuite2, true);
            }
            fn(errSuite);
          });
        } else {
          self2.suite = orig;
          fn(errSuite);
        }
      }
      function next(err, errSuite) {
        if (self2.failures && suite._bail) {
          tests = [];
        }
        if (self2._abort) {
          return fn();
        }
        if (err) {
          return hookErr(err, errSuite, true);
        }
        test = tests.shift();
        if (!test) {
          return fn();
        }
        var match = self2._grep.test(test.fullTitle());
        if (self2._invert) {
          match = !match;
        }
        if (!match) {
          if (self2._grep !== self2._defaultGrep) {
            Runner.immediately(next);
          } else {
            next();
          }
          return;
        }
        if (test.isPending()) {
          if (self2.forbidPending) {
            self2.fail(test, new Error("Pending test forbidden"), true);
          } else {
            test.state = STATE_PENDING;
            self2.emit(constants.EVENT_TEST_PENDING, test);
          }
          self2.emit(constants.EVENT_TEST_END, test);
          return next();
        }
        self2.emit(constants.EVENT_TEST_BEGIN, self2.test = test);
        self2.hookDown(HOOK_TYPE_BEFORE_EACH, function(err2, errSuite2) {
          if (test.isPending()) {
            if (self2.forbidPending) {
              self2.fail(test, new Error("Pending test forbidden"), true);
            } else {
              test.state = STATE_PENDING;
              self2.emit(constants.EVENT_TEST_PENDING, test);
            }
            self2.emit(constants.EVENT_TEST_END, test);
            var origSuite = self2.suite;
            self2.suite = errSuite2 || self2.suite;
            return self2.hookUp(HOOK_TYPE_AFTER_EACH, function(e, eSuite) {
              self2.suite = origSuite;
              next(e, eSuite);
            });
          }
          if (err2) {
            return hookErr(err2, errSuite2, false);
          }
          self2.currentRunnable = self2.test;
          self2.runTest(function(err3) {
            test = self2.test;
            if (test.pending) {
              if (self2.forbidPending) {
                self2.fail(test, new Error("Pending test forbidden"), true);
              } else {
                test.state = STATE_PENDING;
                self2.emit(constants.EVENT_TEST_PENDING, test);
              }
              self2.emit(constants.EVENT_TEST_END, test);
              return self2.hookUp(HOOK_TYPE_AFTER_EACH, next);
            } else if (err3) {
              var retry = test.currentRetry();
              if (retry < test.retries()) {
                var clonedTest = test.clone();
                clonedTest.currentRetry(retry + 1);
                tests.unshift(clonedTest);
                self2.emit(constants.EVENT_TEST_RETRY, test, err3);
                return self2.hookUp(HOOK_TYPE_AFTER_EACH, next);
              } else {
                self2.fail(test, err3);
              }
              self2.emit(constants.EVENT_TEST_END, test);
              return self2.hookUp(HOOK_TYPE_AFTER_EACH, next);
            }
            test.state = STATE_PASSED;
            self2.emit(constants.EVENT_TEST_PASS, test);
            self2.emit(constants.EVENT_TEST_END, test);
            self2.hookUp(HOOK_TYPE_AFTER_EACH, next);
          });
        });
      }
      this.next = next;
      this.hookErr = hookErr;
      next();
    };
    Runner.prototype.runSuite = function(suite, fn) {
      var i = 0;
      var self2 = this;
      var total = this.grepTotal(suite);
      debug("runSuite(): running %s", suite.fullTitle());
      if (!total || self2.failures && suite._bail) {
        debug("runSuite(): bailing");
        return fn();
      }
      this.emit(constants.EVENT_SUITE_BEGIN, this.suite = suite);
      function next(errSuite) {
        if (errSuite) {
          if (errSuite === suite) {
            return done();
          }
          return done(errSuite);
        }
        if (self2._abort) {
          return done();
        }
        var curr = suite.suites[i++];
        if (!curr) {
          return done();
        }
        if (self2._grep !== self2._defaultGrep) {
          Runner.immediately(function() {
            self2.runSuite(curr, next);
          });
        } else {
          self2.runSuite(curr, next);
        }
      }
      function done(errSuite) {
        self2.suite = suite;
        self2.nextSuite = next;
        delete self2.test;
        self2.hook(HOOK_TYPE_AFTER_ALL, function() {
          self2.emit(constants.EVENT_SUITE_END, suite);
          fn(errSuite);
        });
      }
      this.nextSuite = next;
      this.hook(HOOK_TYPE_BEFORE_ALL, function(err) {
        if (err) {
          return done();
        }
        self2.runTests(suite, next);
      });
    };
    Runner.prototype._uncaught = function(err) {
      if (!(this instanceof Runner)) {
        throw createFatalError(
          "Runner#uncaught() called with invalid context",
          this
        );
      }
      if (err instanceof Pending) {
        debug("uncaught(): caught a Pending");
        return;
      }
      if (this.allowUncaught && !utils.isBrowser()) {
        debug("uncaught(): bubbling exception due to --allow-uncaught");
        throw err;
      }
      if (this.state === constants.STATE_STOPPED) {
        debug("uncaught(): throwing after run has completed!");
        throw err;
      }
      if (err) {
        debug("uncaught(): got truthy exception %O", err);
      } else {
        debug("uncaught(): undefined/falsy exception");
        err = createInvalidExceptionError(
          "Caught falsy/undefined exception which would otherwise be uncaught. No stack trace found; try a debugger",
          err
        );
      }
      if (!isError(err)) {
        err = thrown2Error(err);
        debug('uncaught(): converted "error" %o to Error', err);
      }
      err.uncaught = true;
      var runnable = this.currentRunnable;
      if (!runnable) {
        runnable = new Runnable("Uncaught error outside test suite");
        debug("uncaught(): no current Runnable; created a phony one");
        runnable.parent = this.suite;
        if (this.state === constants.STATE_RUNNING) {
          debug("uncaught(): failing gracefully");
          this.fail(runnable, err);
        } else {
          debug("uncaught(): test run has not yet started; unrecoverable");
          this.emit(constants.EVENT_RUN_BEGIN);
          this.fail(runnable, err);
          this.emit(constants.EVENT_RUN_END);
        }
        return;
      }
      runnable.clearTimeout();
      if (runnable.isFailed()) {
        debug("uncaught(): Runnable has already failed");
        return;
      } else if (runnable.isPending()) {
        debug("uncaught(): pending Runnable wound up failing!");
        this.fail(runnable, err, true);
        return;
      }
      if (runnable.isPassed()) {
        debug("uncaught(): Runnable has already passed; bailing gracefully");
        this.fail(runnable, err);
        this.abort();
      } else {
        debug("uncaught(): forcing Runnable to complete with Error");
        return runnable.callback(err);
      }
    };
    Runner.prototype.run = function(fn, opts = {}) {
      var rootSuite = this.suite;
      var options = opts.options || {};
      debug("run(): got options: %O", options);
      fn = fn || function() {
      };
      const end = () => {
        if (!this.total && this._opts.failZero) this.failures = 1;
        debug("run(): root suite completed; emitting %s", constants.EVENT_RUN_END);
        this.emit(constants.EVENT_RUN_END);
      };
      const begin = () => {
        debug("run(): emitting %s", constants.EVENT_RUN_BEGIN);
        this.emit(constants.EVENT_RUN_BEGIN);
        debug("run(): emitted %s", constants.EVENT_RUN_BEGIN);
        this.runSuite(rootSuite, end);
      };
      const prepare = () => {
        debug("run(): starting");
        if (rootSuite.hasOnly()) {
          rootSuite.filterOnly();
          debug("run(): filtered exclusive Runnables");
        }
        this.state = constants.STATE_RUNNING;
        if (this._opts.delay) {
          this.emit(constants.EVENT_DELAY_END);
          debug('run(): "delay" ended');
        }
        return begin();
      };
      if (this._opts.cleanReferencesAfterRun) {
        this.on(constants.EVENT_SUITE_END, (suite) => {
          suite.cleanReferences();
        });
      }
      this.on(constants.EVENT_RUN_END, function() {
        this.state = constants.STATE_STOPPED;
        debug("run(): emitted %s", constants.EVENT_RUN_END);
        fn(this.failures);
      });
      this._removeEventListener(process, "uncaughtException", this.uncaught);
      this._removeEventListener(process, "unhandledRejection", this.unhandled);
      this._addEventListener(process, "uncaughtException", this.uncaught);
      this._addEventListener(process, "unhandledRejection", this.unhandled);
      if (this._opts.delay) {
        this.emit(constants.EVENT_DELAY_BEGIN, rootSuite);
        rootSuite.once(EVENT_ROOT_SUITE_RUN, prepare);
        debug("run(): waiting for green light due to --delay");
      } else {
        Runner.immediately(prepare);
      }
      return this;
    };
    Runner.prototype.linkPartialObjects = function() {
      return this;
    };
    Runner.prototype.runAsync = async function runAsync(opts = {}) {
      return new Promise((resolve2) => {
        this.run(resolve2, opts);
      });
    };
    Runner.prototype.abort = function() {
      debug("abort(): aborting");
      this._abort = true;
      return this;
    };
    Runner.prototype.isParallelMode = function isParallelMode() {
      return false;
    };
    Runner.prototype.workerReporter = function() {
      throw createUnsupportedError("workerReporter() not supported in serial mode");
    };
    function filterLeaks(ok, globals2) {
      return globals2.filter(function(key) {
        if (/^\d+/.test(key)) {
          return false;
        }
        if (global.navigator && /^getInterface/.test(key)) {
          return false;
        }
        if (global.navigator && /^\d+/.test(key)) {
          return false;
        }
        if (/^mocha-/.test(key)) {
          return false;
        }
        var matched = ok.filter(function(ok2) {
          if (~ok2.indexOf("*")) {
            return key.indexOf(ok2.split("*")[0]) === 0;
          }
          return key === ok2;
        });
        return !matched.length && (!global.navigator || key !== "onerror");
      });
    }
    function isError(err) {
      return err instanceof Error || err && typeof err.message === "string";
    }
    function thrown2Error(err) {
      return new Error(
        `the ${utils.canonicalType(err)} ${stringify(
          err
        )} was thrown, throw an Error :)`
      );
    }
    Runner.constants = constants;
    module2.exports = Runner;
  }
});

// node_modules/mocha/lib/reporters/base.js
var require_base2 = __commonJS({
  "node_modules/mocha/lib/reporters/base.js"(exports2, module2) {
    "use strict";
    var diff = require_lib();
    var milliseconds = require_ms();
    var utils = require_utils();
    var supportsColor = require_supports_color();
    var symbols = require_log_symbols();
    var constants = require_runner().constants;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var isBrowser = utils.isBrowser();
    function getBrowserWindowSize() {
      if ("innerHeight" in global) {
        return [global.innerHeight, global.innerWidth];
      }
      return [640, 480];
    }
    exports2 = module2.exports = Base;
    var isatty = isBrowser || process.stdout.isTTY && process.stderr.isTTY;
    var consoleLog = console.log;
    exports2.useColors = !isBrowser && (supportsColor.stdout || process.env.MOCHA_COLORS !== void 0);
    exports2.inlineDiffs = false;
    exports2.maxDiffSize = 8192;
    exports2.colors = {
      pass: 90,
      fail: 31,
      "bright pass": 92,
      "bright fail": 91,
      "bright yellow": 93,
      pending: 36,
      suite: 0,
      "error title": 0,
      "error message": 31,
      "error stack": 90,
      checkmark: 32,
      fast: 90,
      medium: 33,
      slow: 31,
      green: 32,
      light: 90,
      "diff gutter": 90,
      "diff added": 32,
      "diff removed": 31,
      "diff added inline": "30;42",
      "diff removed inline": "30;41"
    };
    exports2.symbols = {
      ok: symbols.success,
      err: symbols.error,
      dot: ".",
      comma: ",",
      bang: "!"
    };
    var color = exports2.color = function(type, str) {
      if (!exports2.useColors) {
        return String(str);
      }
      return "\x1B[" + exports2.colors[type] + "m" + str + "\x1B[0m";
    };
    exports2.window = {
      width: 75
    };
    if (isatty) {
      if (isBrowser) {
        exports2.window.width = getBrowserWindowSize()[1];
      } else {
        exports2.window.width = process.stdout.getWindowSize(1)[0];
      }
    }
    exports2.cursor = {
      hide: function() {
        isatty && process.stdout.write("\x1B[?25l");
      },
      show: function() {
        isatty && process.stdout.write("\x1B[?25h");
      },
      deleteLine: function() {
        isatty && process.stdout.write("\x1B[2K");
      },
      beginningOfLine: function() {
        isatty && process.stdout.write("\x1B[0G");
      },
      CR: function() {
        if (isatty) {
          exports2.cursor.deleteLine();
          exports2.cursor.beginningOfLine();
        } else {
          process.stdout.write("\r");
        }
      }
    };
    var showDiff = exports2.showDiff = function(err) {
      return err && err.showDiff !== false && sameType(err.actual, err.expected) && err.expected !== void 0;
    };
    function stringifyDiffObjs(err) {
      if (!utils.isString(err.actual) || !utils.isString(err.expected)) {
        err.actual = utils.stringify(err.actual);
        err.expected = utils.stringify(err.expected);
      }
    }
    var generateDiff = exports2.generateDiff = function(actual, expected) {
      try {
        var maxLen = exports2.maxDiffSize;
        var skipped = 0;
        if (maxLen > 0) {
          skipped = Math.max(actual.length - maxLen, expected.length - maxLen);
          actual = actual.slice(0, maxLen);
          expected = expected.slice(0, maxLen);
        }
        let result = exports2.inlineDiffs ? inlineDiff(actual, expected) : unifiedDiff(actual, expected);
        if (skipped > 0) {
          result = `${result}
      [mocha] output truncated to ${maxLen} characters, see "maxDiffSize" reporter-option
`;
        }
        return result;
      } catch (err) {
        var msg = "\n      " + color("diff added", "+ expected") + " " + color("diff removed", "- actual:  failed to generate Mocha diff") + "\n";
        return msg;
      }
    };
    var getFullErrorStack = function(err, seen) {
      if (seen && seen.has(err)) {
        return { message: "", msg: "<circular>", stack: "" };
      }
      var message;
      if (typeof err.inspect === "function") {
        message = err.inspect() + "";
      } else if (err.message && typeof err.message.toString === "function") {
        message = err.message + "";
      } else {
        message = "";
      }
      var msg;
      var stack = err.stack || message;
      var index = message ? stack.indexOf(message) : -1;
      if (index === -1) {
        msg = message;
      } else {
        index += message.length;
        msg = stack.slice(0, index);
        stack = stack.slice(index + 1);
        if (err.cause) {
          seen = seen || /* @__PURE__ */ new Set();
          seen.add(err);
          const causeStack = getFullErrorStack(err.cause, seen);
          stack += "\n   Caused by: " + causeStack.msg + (causeStack.stack ? "\n" + causeStack.stack : "");
        }
      }
      return {
        message,
        msg,
        stack
      };
    };
    exports2.list = function(failures) {
      var multipleErr, multipleTest;
      Base.consoleLog();
      failures.forEach(function(test, i) {
        var fmt = color("error title", "  %s) %s:\n") + color("error message", "     %s") + color("error stack", "\n%s\n");
        var err;
        if (test.err && test.err.multiple) {
          if (multipleTest !== test) {
            multipleTest = test;
            multipleErr = [test.err].concat(test.err.multiple);
          }
          err = multipleErr.shift();
        } else {
          err = test.err;
        }
        var { message, msg, stack } = getFullErrorStack(err);
        if (err.uncaught) {
          msg = "Uncaught " + msg;
        }
        if (!exports2.hideDiff && showDiff(err)) {
          stringifyDiffObjs(err);
          fmt = color("error title", "  %s) %s:\n%s") + color("error stack", "\n%s\n");
          var match = message.match(/^([^:]+): expected/);
          msg = "\n      " + color("error message", match ? match[1] : msg);
          msg += generateDiff(err.actual, err.expected);
        }
        stack = stack.replace(/^/gm, "  ");
        var testTitle = "";
        test.titlePath().forEach(function(str, index) {
          if (index !== 0) {
            testTitle += "\n     ";
          }
          for (var i2 = 0; i2 < index; i2++) {
            testTitle += "  ";
          }
          testTitle += str;
        });
        Base.consoleLog(fmt, i + 1, testTitle, msg, stack);
      });
    };
    function Base(runner, options) {
      var failures = this.failures = [];
      if (!runner) {
        throw new TypeError("Missing runner argument");
      }
      this.options = options || {};
      this.runner = runner;
      this.stats = runner.stats;
      var maxDiffSizeOpt = this.options.reporterOption && this.options.reporterOption.maxDiffSize;
      if (maxDiffSizeOpt !== void 0 && !isNaN(Number(maxDiffSizeOpt))) {
        exports2.maxDiffSize = Number(maxDiffSizeOpt);
      }
      runner.on(EVENT_TEST_PASS, function(test) {
        if (test.duration > test.slow()) {
          test.speed = "slow";
        } else if (test.duration > test.slow() / 2) {
          test.speed = "medium";
        } else {
          test.speed = "fast";
        }
      });
      runner.on(EVENT_TEST_FAIL, function(test, err) {
        if (showDiff(err)) {
          stringifyDiffObjs(err);
        }
        if (test.err && err instanceof Error) {
          test.err.multiple = (test.err.multiple || []).concat(err);
        } else {
          test.err = err;
        }
        failures.push(test);
      });
    }
    Base.prototype.epilogue = function() {
      var stats = this.stats;
      var fmt;
      Base.consoleLog();
      fmt = color("bright pass", " ") + color("green", " %d passing") + color("light", " (%s)");
      Base.consoleLog(fmt, stats.passes || 0, milliseconds(stats.duration));
      if (stats.pending) {
        fmt = color("pending", " ") + color("pending", " %d pending");
        Base.consoleLog(fmt, stats.pending);
      }
      if (stats.failures) {
        fmt = color("fail", "  %d failing");
        Base.consoleLog(fmt, stats.failures);
        Base.list(this.failures);
        Base.consoleLog();
      }
      Base.consoleLog();
    };
    function pad(str, len) {
      str = String(str);
      return Array(len - str.length + 1).join(" ") + str;
    }
    function inlineDiff(actual, expected) {
      var msg = errorDiff(actual, expected);
      var lines = msg.split("\n");
      if (lines.length > 4) {
        var width = String(lines.length).length;
        msg = lines.map(function(str, i) {
          return pad(++i, width) + " | " + str;
        }).join("\n");
      }
      msg = "\n" + color("diff removed inline", "actual") + " " + color("diff added inline", "expected") + "\n\n" + msg + "\n";
      msg = msg.replace(/^/gm, "      ");
      return msg;
    }
    function unifiedDiff(actual, expected) {
      var indent = "      ";
      function cleanUp(line) {
        if (line[0] === "+") {
          return indent + colorLines("diff added", line);
        }
        if (line[0] === "-") {
          return indent + colorLines("diff removed", line);
        }
        if (line.match(/@@/)) {
          return "--";
        }
        if (line.match(/\\ No newline/)) {
          return null;
        }
        return indent + line;
      }
      function notBlank(line) {
        return typeof line !== "undefined" && line !== null;
      }
      var msg = diff.createPatch("string", actual, expected);
      var lines = msg.split("\n").splice(5);
      return "\n      " + colorLines("diff added", "+ expected") + " " + colorLines("diff removed", "- actual") + "\n\n" + lines.map(cleanUp).filter(notBlank).join("\n");
    }
    function errorDiff(actual, expected) {
      return diff.diffWordsWithSpace(actual, expected).map(function(str) {
        if (str.added) {
          return colorLines("diff added inline", str.value);
        }
        if (str.removed) {
          return colorLines("diff removed inline", str.value);
        }
        return str.value;
      }).join("");
    }
    function colorLines(name, str) {
      return str.split("\n").map(function(str2) {
        return color(name, str2);
      }).join("\n");
    }
    var objToString = Object.prototype.toString;
    function sameType(a, b) {
      return objToString.call(a) === objToString.call(b);
    }
    Base.consoleLog = consoleLog;
    Base.abstract = true;
  }
});

// node_modules/mocha/lib/reporters/dot.js
var require_dot = __commonJS({
  "node_modules/mocha/lib/reporters/dot.js"(exports2, module2) {
    "use strict";
    var Base = require_base2();
    var inherits = require_utils().inherits;
    var constants = require_runner().constants;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    exports2 = module2.exports = Dot;
    function Dot(runner, options) {
      Base.call(this, runner, options);
      var self2 = this;
      var width = Base.window.width * 0.75 | 0;
      var n = -1;
      runner.on(EVENT_RUN_BEGIN, function() {
        process.stdout.write("\n");
      });
      runner.on(EVENT_TEST_PENDING, function() {
        if (++n % width === 0) {
          process.stdout.write("\n  ");
        }
        process.stdout.write(Base.color("pending", Base.symbols.comma));
      });
      runner.on(EVENT_TEST_PASS, function(test) {
        if (++n % width === 0) {
          process.stdout.write("\n  ");
        }
        if (test.speed === "slow") {
          process.stdout.write(Base.color("bright yellow", Base.symbols.dot));
        } else {
          process.stdout.write(Base.color(test.speed, Base.symbols.dot));
        }
      });
      runner.on(EVENT_TEST_FAIL, function() {
        if (++n % width === 0) {
          process.stdout.write("\n  ");
        }
        process.stdout.write(Base.color("fail", Base.symbols.bang));
      });
      runner.once(EVENT_RUN_END, function() {
        process.stdout.write("\n");
        self2.epilogue();
      });
    }
    inherits(Dot, Base);
    Dot.description = "dot matrix representation";
  }
});

// node_modules/mocha/lib/reporters/doc.js
var require_doc = __commonJS({
  "node_modules/mocha/lib/reporters/doc.js"(exports2, module2) {
    "use strict";
    var Base = require_base2();
    var utils = require_utils();
    var constants = require_runner().constants;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
    var EVENT_SUITE_END = constants.EVENT_SUITE_END;
    exports2 = module2.exports = Doc;
    function Doc(runner, options) {
      Base.call(this, runner, options);
      var indents = 2;
      function indent() {
        return Array(indents).join("  ");
      }
      runner.on(EVENT_SUITE_BEGIN, function(suite) {
        if (suite.root) {
          return;
        }
        ++indents;
        Base.consoleLog('%s<section class="suite">', indent());
        ++indents;
        Base.consoleLog("%s<h1>%s</h1>", indent(), utils.escape(suite.title));
        Base.consoleLog("%s<dl>", indent());
      });
      runner.on(EVENT_SUITE_END, function(suite) {
        if (suite.root) {
          return;
        }
        Base.consoleLog("%s</dl>", indent());
        --indents;
        Base.consoleLog("%s</section>", indent());
        --indents;
      });
      runner.on(EVENT_TEST_PASS, function(test) {
        Base.consoleLog("%s  <dt>%s</dt>", indent(), utils.escape(test.title));
        Base.consoleLog("%s  <dt>%s</dt>", indent(), utils.escape(test.file));
        var code = utils.escape(utils.clean(test.body));
        Base.consoleLog("%s  <dd><pre><code>%s</code></pre></dd>", indent(), code);
      });
      runner.on(EVENT_TEST_FAIL, function(test, err) {
        Base.consoleLog(
          '%s  <dt class="error">%s</dt>',
          indent(),
          utils.escape(test.title)
        );
        Base.consoleLog(
          '%s  <dt class="error">%s</dt>',
          indent(),
          utils.escape(test.file)
        );
        var code = utils.escape(utils.clean(test.body));
        Base.consoleLog(
          '%s  <dd class="error"><pre><code>%s</code></pre></dd>',
          indent(),
          code
        );
        Base.consoleLog(
          '%s  <dd class="error">%s</dd>',
          indent(),
          utils.escape(err)
        );
      });
    }
    Doc.description = "HTML documentation";
  }
});

// node_modules/mocha/lib/reporters/tap.js
var require_tap = __commonJS({
  "node_modules/mocha/lib/reporters/tap.js"(exports2, module2) {
    "use strict";
    var util = require("node:util");
    var Base = require_base2();
    var constants = require_runner().constants;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    var EVENT_TEST_END = constants.EVENT_TEST_END;
    var inherits = require_utils().inherits;
    var sprintf = util.format;
    exports2 = module2.exports = TAP;
    function TAP(runner, options) {
      Base.call(this, runner, options);
      var self2 = this;
      var n = 1;
      var tapVersion = "12";
      if (options && options.reporterOptions) {
        if (options.reporterOptions.tapVersion) {
          tapVersion = options.reporterOptions.tapVersion.toString();
        }
      }
      this._producer = createProducer(tapVersion);
      runner.once(EVENT_RUN_BEGIN, function() {
        self2._producer.writeVersion();
      });
      runner.on(EVENT_TEST_END, function() {
        ++n;
      });
      runner.on(EVENT_TEST_PENDING, function(test) {
        self2._producer.writePending(n, test);
      });
      runner.on(EVENT_TEST_PASS, function(test) {
        self2._producer.writePass(n, test);
      });
      runner.on(EVENT_TEST_FAIL, function(test, err) {
        self2._producer.writeFail(n, test, err);
      });
      runner.once(EVENT_RUN_END, function() {
        self2._producer.writeEpilogue(runner.stats);
      });
    }
    inherits(TAP, Base);
    function title(test) {
      return test.fullTitle().replace(/#/g, "");
    }
    function println() {
      var vargs = Array.from(arguments);
      vargs[0] += "\n";
      process.stdout.write(sprintf.apply(null, vargs));
    }
    function createProducer(tapVersion) {
      var producers = {
        12: new TAP12Producer(),
        13: new TAP13Producer()
      };
      var producer = producers[tapVersion];
      if (!producer) {
        throw new Error(
          "invalid or unsupported TAP version: " + JSON.stringify(tapVersion)
        );
      }
      return producer;
    }
    function TAPProducer() {
    }
    TAPProducer.prototype.writeVersion = function() {
    };
    TAPProducer.prototype.writePlan = function(ntests) {
      println("%d..%d", 1, ntests);
    };
    TAPProducer.prototype.writePass = function(n, test) {
      println("ok %d %s", n, title(test));
    };
    TAPProducer.prototype.writePending = function(n, test) {
      println("ok %d %s # SKIP -", n, title(test));
    };
    TAPProducer.prototype.writeFail = function(n, test) {
      println("not ok %d %s", n, title(test));
    };
    TAPProducer.prototype.writeEpilogue = function(stats) {
      println("# tests " + (stats.passes + stats.failures));
      println("# pass " + stats.passes);
      println("# fail " + stats.failures);
      this.writePlan(stats.passes + stats.failures + stats.pending);
    };
    function TAP12Producer() {
      this.writeFail = function(n, test, err) {
        TAPProducer.prototype.writeFail.call(this, n, test, err);
        if (err.message) {
          println(err.message.replace(/^/gm, "  "));
        }
        if (err.stack) {
          println(err.stack.replace(/^/gm, "  "));
        }
      };
    }
    inherits(TAP12Producer, TAPProducer);
    function TAP13Producer() {
      this.writeVersion = function() {
        println("TAP version 13");
      };
      this.writeFail = function(n, test, err) {
        TAPProducer.prototype.writeFail.call(this, n, test, err);
        var emitYamlBlock = err.message != null || err.stack != null;
        if (emitYamlBlock) {
          println(indent(1) + "---");
          if (err.message) {
            println(indent(2) + "message: |-");
            println(err.message.replace(/^/gm, indent(3)));
          }
          if (err.stack) {
            println(indent(2) + "stack: |-");
            println(err.stack.replace(/^/gm, indent(3)));
          }
          println(indent(1) + "...");
        }
      };
      function indent(level) {
        return Array(level + 1).join("  ");
      }
    }
    inherits(TAP13Producer, TAPProducer);
    TAP.description = "TAP-compatible output";
  }
});

// node_modules/mocha/lib/reporters/json.js
var require_json2 = __commonJS({
  "node_modules/mocha/lib/reporters/json.js"(exports2, module2) {
    "use strict";
    var Base = require_base2();
    var fs = require("node:fs");
    var path2 = require("node:path");
    var createUnsupportedError = require_errors().createUnsupportedError;
    var utils = require_utils();
    var constants = require_runner().constants;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var EVENT_TEST_END = constants.EVENT_TEST_END;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    exports2 = module2.exports = JSONReporter;
    function JSONReporter(runner, options = {}) {
      Base.call(this, runner, options);
      var self2 = this;
      var tests = [];
      var pending = [];
      var failures = [];
      var passes = [];
      var output;
      if (options.reporterOption && options.reporterOption.output) {
        if (utils.isBrowser()) {
          throw createUnsupportedError("file output not supported in browser");
        }
        output = options.reporterOption.output;
      }
      runner.on(EVENT_TEST_END, function(test) {
        tests.push(test);
      });
      runner.on(EVENT_TEST_PASS, function(test) {
        passes.push(test);
      });
      runner.on(EVENT_TEST_FAIL, function(test) {
        failures.push(test);
      });
      runner.on(EVENT_TEST_PENDING, function(test) {
        pending.push(test);
      });
      runner.once(EVENT_RUN_END, function() {
        var obj = {
          stats: self2.stats,
          tests: tests.map(clean),
          pending: pending.map(clean),
          failures: failures.map(clean),
          passes: passes.map(clean)
        };
        runner.testResults = obj;
        var json = JSON.stringify(obj, null, 2);
        if (output) {
          try {
            fs.mkdirSync(path2.dirname(output), { recursive: true });
            fs.writeFileSync(output, json);
          } catch (err) {
            console.error(
              `${Base.symbols.err} [mocha] writing output to "${output}" failed: ${err.message}
`
            );
            process.stdout.write(json);
          }
        } else {
          process.stdout.write(json);
        }
      });
    }
    function clean(test) {
      var err = test.err || {};
      if (err instanceof Error) {
        err = errorJSON(err);
      }
      return {
        title: test.title,
        fullTitle: test.fullTitle(),
        file: test.file,
        duration: test.duration,
        currentRetry: test.currentRetry(),
        speed: test.speed,
        err: cleanCycles(err)
      };
    }
    function cleanCycles(obj) {
      var cache = [];
      return JSON.parse(
        JSON.stringify(obj, function(key, value) {
          if (typeof value === "object" && value !== null) {
            if (cache.indexOf(value) !== -1) {
              return "" + value;
            }
            cache.push(value);
          }
          return value;
        })
      );
    }
    function errorJSON(err) {
      var res = {};
      Object.getOwnPropertyNames(err).forEach(function(key) {
        res[key] = err[key];
      }, err);
      return res;
    }
    JSONReporter.description = "single JSON object";
  }
});

// node_modules/mocha/lib/reporters/html.js
var require_html = __commonJS({
  "node_modules/mocha/lib/reporters/html.js"(exports2, module2) {
    "use strict";
    var Base = require_base2();
    var utils = require_utils();
    var escapeRe = require_escape_string_regexp();
    var constants = require_runner().constants;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
    var EVENT_SUITE_END = constants.EVENT_SUITE_END;
    var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    var escape = utils.escape;
    var Date2 = global.Date;
    exports2 = module2.exports = HTML;
    var statsTemplate = '<ul id="mocha-stats"><li class="result"></li><li class="progress-contain"><progress class="progress-element" max="100" value="0"></progress><svg class="progress-ring"><circle class="ring-flatlight" stroke-dasharray="100%,0%"/><circle class="ring-highlight" stroke-dasharray="0%,100%"/></svg><div class="progress-text">0%</div></li><li class="passes"><a href="javascript:void(0);">passes:</a> <em>0</em></li><li class="failures"><a href="javascript:void(0);">failures:</a> <em>0</em></li><li class="duration">duration: <em>0</em>s</li></ul>';
    var playIcon = "&#x2023;";
    function HTML(runner, options) {
      Base.call(this, runner, options);
      var self2 = this;
      var stats = this.stats;
      var stat = fragment(statsTemplate);
      var items = stat.getElementsByTagName("li");
      const resultIndex = 0;
      const progressIndex = 1;
      const passesIndex = 2;
      const failuresIndex = 3;
      const durationIndex = 4;
      var resultIndicator = items[resultIndex];
      const passesStat = items[passesIndex];
      const passesCount = passesStat.getElementsByTagName("em")[0];
      const passesLink = passesStat.getElementsByTagName("a")[0];
      const failuresStat = items[failuresIndex];
      const failuresCount = failuresStat.getElementsByTagName("em")[0];
      const failuresLink = failuresStat.getElementsByTagName("a")[0];
      var duration = items[durationIndex].getElementsByTagName("em")[0];
      var report = fragment('<ul id="mocha-report"></ul>');
      var stack = [report];
      var progressText = items[progressIndex].getElementsByTagName("div")[0];
      var progressBar = items[progressIndex].getElementsByTagName("progress")[0];
      var progressRing = [
        items[progressIndex].getElementsByClassName("ring-flatlight")[0],
        items[progressIndex].getElementsByClassName("ring-highlight")[0]
      ];
      var root = document.getElementById("mocha");
      if (!root) {
        return error("#mocha div missing, add it to your document");
      }
      on(passesLink, "click", function(evt) {
        evt.preventDefault();
        unhide();
        var name = /pass/.test(report.className) ? "" : " pass";
        report.className = report.className.replace(/fail|pass/g, "") + name;
        if (report.className.trim()) {
          hideSuitesWithout("test pass");
        }
      });
      on(failuresLink, "click", function(evt) {
        evt.preventDefault();
        unhide();
        var name = /fail/.test(report.className) ? "" : " fail";
        report.className = report.className.replace(/fail|pass/g, "") + name;
        if (report.className.trim()) {
          hideSuitesWithout("test fail");
        }
      });
      root.appendChild(stat);
      root.appendChild(report);
      runner.on(EVENT_SUITE_BEGIN, function(suite) {
        if (suite.root) {
          return;
        }
        var url = self2.suiteURL(suite);
        var el = fragment(
          '<li class="suite"><h1><a href="%s">%s</a></h1></li>',
          url,
          escape(suite.title)
        );
        stack[0].appendChild(el);
        stack.unshift(document.createElement("ul"));
        el.appendChild(stack[0]);
      });
      runner.on(EVENT_SUITE_END, function(suite) {
        if (suite.root) {
          if (stats.failures === 0) {
            text(resultIndicator, "\u2713");
            stat.className += " pass";
          }
          updateStats();
          return;
        }
        stack.shift();
      });
      runner.on(EVENT_TEST_PASS, function(test) {
        var url = self2.testURL(test);
        var markup = '<li class="test pass %e"><h2>%e<span class="duration">%ems</span> <a href="%s" class="replay">' + playIcon + "</a></h2></li>";
        var el = fragment(markup, test.speed, test.title, test.duration, url);
        self2.addCodeToggle(el, test.body);
        appendToStack(el);
        updateStats();
      });
      runner.on(EVENT_TEST_FAIL, function(test) {
        text(resultIndicator, "\u2716");
        stat.className += " fail";
        var el = fragment(
          '<li class="test fail"><h2>%e <a href="%e" class="replay">' + playIcon + "</a></h2></li>",
          test.title,
          self2.testURL(test)
        );
        var stackString;
        var message = test.err.toString();
        if (message === "[object Error]") {
          message = test.err.message;
        }
        if (test.err.stack) {
          var indexOfMessage = test.err.stack.indexOf(test.err.message);
          if (indexOfMessage === -1) {
            stackString = test.err.stack;
          } else {
            stackString = test.err.stack.slice(
              test.err.message.length + indexOfMessage
            );
          }
        } else if (test.err.sourceURL && test.err.line !== void 0) {
          stackString = "\n(" + test.err.sourceURL + ":" + test.err.line + ")";
        }
        stackString = stackString || "";
        if (test.err.htmlMessage && stackString) {
          el.appendChild(
            fragment(
              '<div class="html-error">%s\n<pre class="error">%e</pre></div>',
              test.err.htmlMessage,
              stackString
            )
          );
        } else if (test.err.htmlMessage) {
          el.appendChild(
            fragment('<div class="html-error">%s</div>', test.err.htmlMessage)
          );
        } else {
          el.appendChild(
            fragment('<pre class="error">%e%e</pre>', message, stackString)
          );
        }
        self2.addCodeToggle(el, test.body);
        appendToStack(el);
        updateStats();
      });
      runner.on(EVENT_TEST_PENDING, function(test) {
        var el = fragment(
          '<li class="test pass pending"><h2>%e</h2></li>',
          test.title
        );
        appendToStack(el);
        updateStats();
      });
      function appendToStack(el) {
        if (stack[0]) {
          stack[0].appendChild(el);
        }
      }
      function updateStats() {
        var percent = stats.tests / runner.total * 100 | 0;
        progressBar.value = percent;
        if (progressText) {
          var decimalPlaces = Math.ceil(Math.log10(runner.total / 100));
          text(
            progressText,
            percent.toFixed(Math.min(Math.max(decimalPlaces, 0), 100)) + "%"
          );
        }
        if (progressRing) {
          var radius = parseFloat(
            getComputedStyle(progressRing[0]).getPropertyValue("r")
          );
          var wholeArc = Math.PI * 2 * radius;
          var highlightArc = percent * (wholeArc / 100);
          progressRing[0].style["stroke-dasharray"] = `0,${highlightArc}px,${wholeArc}px`;
          progressRing[1].style["stroke-dasharray"] = `${highlightArc}px,${wholeArc}px`;
        }
        var ms = new Date2() - stats.start;
        text(passesCount, stats.passes);
        text(failuresCount, stats.failures);
        text(duration, (ms / 1e3).toFixed(2));
      }
    }
    function makeUrl(s) {
      var search = window.location.search;
      if (search) {
        search = search.replace(/[?&](?:f?grep|invert)=[^&\s]*/g, "").replace(/^&/, "?");
      }
      return window.location.pathname + (search ? search + "&" : "?") + "grep=" + encodeURIComponent(s);
    }
    HTML.prototype.suiteURL = function(suite) {
      return makeUrl("^" + escapeRe(suite.fullTitle()) + " ");
    };
    HTML.prototype.testURL = function(test) {
      return makeUrl("^" + escapeRe(test.fullTitle()) + "$");
    };
    HTML.prototype.addCodeToggle = function(el, contents) {
      var h2 = el.getElementsByTagName("h2")[0];
      on(h2, "click", function() {
        pre.style.display = pre.style.display === "none" ? "block" : "none";
      });
      var pre = fragment("<pre><code>%e</code></pre>", utils.clean(contents));
      el.appendChild(pre);
      pre.style.display = "none";
    };
    function error(msg) {
      document.body.appendChild(fragment('<div id="mocha-error">%s</div>', msg));
    }
    function fragment(html) {
      var args = arguments;
      var div = document.createElement("div");
      var i = 1;
      div.innerHTML = html.replace(/%([se])/g, function(_, type) {
        switch (type) {
          case "s":
            return String(args[i++]);
          case "e":
            return escape(args[i++]);
        }
      });
      return div.firstChild;
    }
    function hideSuitesWithout(classname) {
      var suites = document.getElementsByClassName("suite");
      for (var i = 0; i < suites.length; i++) {
        var els = suites[i].getElementsByClassName(classname);
        if (!els.length) {
          suites[i].className += " hidden";
        }
      }
    }
    function unhide() {
      var els = document.getElementsByClassName("suite hidden");
      while (els.length > 0) {
        els[0].className = els[0].className.replace("suite hidden", "suite");
      }
    }
    function text(el, contents) {
      if (el.textContent) {
        el.textContent = contents;
      } else {
        el.innerText = contents;
      }
    }
    function on(el, event, fn) {
      if (el.addEventListener) {
        el.addEventListener(event, fn, false);
      } else {
        el.attachEvent("on" + event, fn);
      }
    }
    HTML.browserOnly = true;
  }
});

// node_modules/mocha/lib/reporters/list.js
var require_list = __commonJS({
  "node_modules/mocha/lib/reporters/list.js"(exports2, module2) {
    "use strict";
    var Base = require_base2();
    var inherits = require_utils().inherits;
    var constants = require_runner().constants;
    var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    var EVENT_TEST_BEGIN = constants.EVENT_TEST_BEGIN;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    var color = Base.color;
    var cursor = Base.cursor;
    exports2 = module2.exports = List;
    function List(runner, options) {
      Base.call(this, runner, options);
      var self2 = this;
      var n = 0;
      runner.on(EVENT_RUN_BEGIN, function() {
        Base.consoleLog();
      });
      runner.on(EVENT_TEST_BEGIN, function(test) {
        process.stdout.write(color("pass", "    " + test.fullTitle() + ": "));
      });
      runner.on(EVENT_TEST_PENDING, function(test) {
        var fmt = color("checkmark", "  -") + color("pending", " %s");
        Base.consoleLog(fmt, test.fullTitle());
      });
      runner.on(EVENT_TEST_PASS, function(test) {
        var fmt = color("checkmark", "  " + Base.symbols.ok) + color("pass", " %s: ") + color(test.speed, "%dms");
        cursor.CR();
        Base.consoleLog(fmt, test.fullTitle(), test.duration);
      });
      runner.on(EVENT_TEST_FAIL, function(test) {
        cursor.CR();
        Base.consoleLog(color("fail", "  %d) %s"), ++n, test.fullTitle());
      });
      runner.once(EVENT_RUN_END, self2.epilogue.bind(self2));
    }
    inherits(List, Base);
    List.description = 'like "spec" reporter but flat';
  }
});

// node_modules/mocha/lib/reporters/min.js
var require_min = __commonJS({
  "node_modules/mocha/lib/reporters/min.js"(exports2, module2) {
    "use strict";
    var Base = require_base2();
    var inherits = require_utils().inherits;
    var constants = require_runner().constants;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    exports2 = module2.exports = Min;
    function Min(runner, options) {
      Base.call(this, runner, options);
      runner.on(EVENT_RUN_BEGIN, function() {
        process.stdout.write("\x1B[2J");
        process.stdout.write("\x1B[1;3H");
      });
      runner.once(EVENT_RUN_END, this.epilogue.bind(this));
    }
    inherits(Min, Base);
    Min.description = "essentially just a summary";
  }
});

// node_modules/mocha/lib/reporters/spec.js
var require_spec = __commonJS({
  "node_modules/mocha/lib/reporters/spec.js"(exports2, module2) {
    "use strict";
    var Base = require_base2();
    var constants = require_runner().constants;
    var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    var EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
    var EVENT_SUITE_END = constants.EVENT_SUITE_END;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    var inherits = require_utils().inherits;
    var color = Base.color;
    exports2 = module2.exports = Spec;
    function Spec(runner, options) {
      Base.call(this, runner, options);
      var self2 = this;
      var indents = 0;
      var n = 0;
      function indent() {
        return Array(indents).join("  ");
      }
      runner.on(EVENT_RUN_BEGIN, function() {
        Base.consoleLog();
      });
      runner.on(EVENT_SUITE_BEGIN, function(suite) {
        ++indents;
        Base.consoleLog(color("suite", "%s%s"), indent(), suite.title);
      });
      runner.on(EVENT_SUITE_END, function() {
        --indents;
        if (indents === 1) {
          Base.consoleLog();
        }
      });
      runner.on(EVENT_TEST_PENDING, function(test) {
        var fmt = indent() + color("pending", "  - %s");
        Base.consoleLog(fmt, test.title);
      });
      runner.on(EVENT_TEST_PASS, function(test) {
        var fmt;
        if (test.speed === "fast") {
          fmt = indent() + color("checkmark", "  " + Base.symbols.ok) + color("pass", " %s");
          Base.consoleLog(fmt, test.title);
        } else {
          fmt = indent() + color("checkmark", "  " + Base.symbols.ok) + color("pass", " %s") + color(test.speed, " (%dms)");
          Base.consoleLog(fmt, test.title, test.duration);
        }
      });
      runner.on(EVENT_TEST_FAIL, function(test) {
        Base.consoleLog(indent() + color("fail", "  %d) %s"), ++n, test.title);
      });
      runner.once(EVENT_RUN_END, self2.epilogue.bind(self2));
    }
    inherits(Spec, Base);
    Spec.description = "hierarchical & verbose [default]";
  }
});

// node_modules/mocha/lib/reporters/nyan.js
var require_nyan = __commonJS({
  "node_modules/mocha/lib/reporters/nyan.js"(exports2, module2) {
    "use strict";
    var Base = require_base2();
    var constants = require_runner().constants;
    var inherits = require_utils().inherits;
    var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    exports2 = module2.exports = NyanCat;
    function NyanCat(runner, options) {
      Base.call(this, runner, options);
      var self2 = this;
      var width = Base.window.width * 0.75 | 0;
      var nyanCatWidth = this.nyanCatWidth = 11;
      this.colorIndex = 0;
      this.numberOfLines = 4;
      this.rainbowColors = self2.generateColors();
      this.scoreboardWidth = 5;
      this.tick = 0;
      this.trajectories = [[], [], [], []];
      this.trajectoryWidthMax = width - nyanCatWidth;
      runner.on(EVENT_RUN_BEGIN, function() {
        Base.cursor.hide();
        self2.draw();
      });
      runner.on(EVENT_TEST_PENDING, function() {
        self2.draw();
      });
      runner.on(EVENT_TEST_PASS, function() {
        self2.draw();
      });
      runner.on(EVENT_TEST_FAIL, function() {
        self2.draw();
      });
      runner.once(EVENT_RUN_END, function() {
        Base.cursor.show();
        for (var i = 0; i < self2.numberOfLines; i++) {
          process.stdout.write("\n");
        }
        self2.epilogue();
      });
    }
    inherits(NyanCat, Base);
    NyanCat.prototype.draw = function() {
      this.appendRainbow();
      this.drawScoreboard();
      this.drawRainbow();
      this.drawNyanCat();
      this.tick = !this.tick;
    };
    NyanCat.prototype.drawScoreboard = function() {
      var stats = this.stats;
      function draw(type, n) {
        process.stdout.write(" ");
        process.stdout.write(Base.color(type, n));
        process.stdout.write("\n");
      }
      draw("green", stats.passes);
      draw("fail", stats.failures);
      draw("pending", stats.pending);
      process.stdout.write("\n");
      this.cursorUp(this.numberOfLines);
    };
    NyanCat.prototype.appendRainbow = function() {
      var segment = this.tick ? "_" : "-";
      var rainbowified = this.rainbowify(segment);
      for (var index = 0; index < this.numberOfLines; index++) {
        var trajectory = this.trajectories[index];
        if (trajectory.length >= this.trajectoryWidthMax) {
          trajectory.shift();
        }
        trajectory.push(rainbowified);
      }
    };
    NyanCat.prototype.drawRainbow = function() {
      var self2 = this;
      this.trajectories.forEach(function(line) {
        process.stdout.write("\x1B[" + self2.scoreboardWidth + "C");
        process.stdout.write(line.join(""));
        process.stdout.write("\n");
      });
      this.cursorUp(this.numberOfLines);
    };
    NyanCat.prototype.drawNyanCat = function() {
      var self2 = this;
      var startWidth = this.scoreboardWidth + this.trajectories[0].length;
      var dist = "\x1B[" + startWidth + "C";
      var padding = "";
      process.stdout.write(dist);
      process.stdout.write("_,------,");
      process.stdout.write("\n");
      process.stdout.write(dist);
      padding = self2.tick ? "  " : "   ";
      process.stdout.write("_|" + padding + "/\\_/\\ ");
      process.stdout.write("\n");
      process.stdout.write(dist);
      padding = self2.tick ? "_" : "__";
      var tail = self2.tick ? "~" : "^";
      process.stdout.write(tail + "|" + padding + this.face() + " ");
      process.stdout.write("\n");
      process.stdout.write(dist);
      padding = self2.tick ? " " : "  ";
      process.stdout.write(padding + '""  "" ');
      process.stdout.write("\n");
      this.cursorUp(this.numberOfLines);
    };
    NyanCat.prototype.face = function() {
      var stats = this.stats;
      if (stats.failures) {
        return "( x .x)";
      } else if (stats.pending) {
        return "( o .o)";
      } else if (stats.passes) {
        return "( ^ .^)";
      }
      return "( - .-)";
    };
    NyanCat.prototype.cursorUp = function(n) {
      process.stdout.write("\x1B[" + n + "A");
    };
    NyanCat.prototype.cursorDown = function(n) {
      process.stdout.write("\x1B[" + n + "B");
    };
    NyanCat.prototype.generateColors = function() {
      var colors = [];
      for (var i = 0; i < 6 * 7; i++) {
        var pi3 = Math.floor(Math.PI / 3);
        var n = i * (1 / 6);
        var r = Math.floor(3 * Math.sin(n) + 3);
        var g = Math.floor(3 * Math.sin(n + 2 * pi3) + 3);
        var b = Math.floor(3 * Math.sin(n + 4 * pi3) + 3);
        colors.push(36 * r + 6 * g + b + 16);
      }
      return colors;
    };
    NyanCat.prototype.rainbowify = function(str) {
      if (!Base.useColors) {
        return str;
      }
      var color = this.rainbowColors[this.colorIndex % this.rainbowColors.length];
      this.colorIndex += 1;
      return "\x1B[38;5;" + color + "m" + str + "\x1B[0m";
    };
    NyanCat.description = '"nyan cat"';
  }
});

// node_modules/mocha/lib/reporters/xunit.js
var require_xunit = __commonJS({
  "node_modules/mocha/lib/reporters/xunit.js"(exports2, module2) {
    "use strict";
    var Base = require_base2();
    var utils = require_utils();
    var fs = require("node:fs");
    var path2 = require("node:path");
    var errors = require_errors();
    var createUnsupportedError = errors.createUnsupportedError;
    var constants = require_runner().constants;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    var STATE_FAILED = require_runnable().constants.STATE_FAILED;
    var inherits = utils.inherits;
    var escape = utils.escape;
    var Date2 = global.Date;
    exports2 = module2.exports = XUnit;
    function XUnit(runner, options) {
      Base.call(this, runner, options);
      var stats = this.stats;
      var tests = [];
      var self2 = this;
      var suiteName;
      var DEFAULT_SUITE_NAME = "Mocha Tests";
      if (options && options.reporterOptions) {
        if (options.reporterOptions.output) {
          if (!fs.createWriteStream) {
            throw createUnsupportedError("file output not supported in browser");
          }
          fs.mkdirSync(path2.dirname(options.reporterOptions.output), {
            recursive: true
          });
          self2.fileStream = fs.createWriteStream(options.reporterOptions.output);
        }
        suiteName = options.reporterOptions.suiteName;
      }
      suiteName = suiteName || DEFAULT_SUITE_NAME;
      runner.on(EVENT_TEST_PENDING, function(test) {
        tests.push(test);
      });
      runner.on(EVENT_TEST_PASS, function(test) {
        tests.push(test);
      });
      runner.on(EVENT_TEST_FAIL, function(test) {
        tests.push(test);
      });
      runner.once(EVENT_RUN_END, function() {
        self2.write(
          tag(
            "testsuite",
            {
              name: suiteName,
              tests: stats.tests,
              failures: 0,
              errors: stats.failures,
              skipped: stats.tests - stats.failures - stats.passes,
              timestamp: new Date2().toUTCString(),
              time: stats.duration / 1e3 || 0
            },
            false
          )
        );
        tests.forEach(function(t) {
          self2.test(t, options);
        });
        self2.write("</testsuite>");
      });
    }
    inherits(XUnit, Base);
    XUnit.prototype.done = function(failures, fn) {
      if (this.fileStream) {
        this.fileStream.end(function() {
          fn(failures);
        });
      } else {
        fn(failures);
      }
    };
    XUnit.prototype.write = function(line) {
      if (this.fileStream) {
        this.fileStream.write(line + "\n");
      } else if (typeof process === "object" && process.stdout) {
        process.stdout.write(line + "\n");
      } else {
        Base.consoleLog(line);
      }
    };
    XUnit.prototype.test = function(test, options) {
      Base.useColors = false;
      var attrs = {
        classname: test.parent.fullTitle(),
        name: test.title,
        file: testFilePath(test.file, options),
        time: test.duration / 1e3 || 0
      };
      if (test.state === STATE_FAILED) {
        var err = test.err;
        var diff = !Base.hideDiff && Base.showDiff(err) ? "\n" + Base.generateDiff(err.actual, err.expected) : "";
        this.write(
          tag(
            "testcase",
            attrs,
            false,
            tag(
              "failure",
              {},
              false,
              escape(err.message) + escape(diff) + "\n" + escape(err.stack)
            )
          )
        );
      } else if (test.isPending()) {
        this.write(tag("testcase", attrs, false, tag("skipped", {}, true)));
      } else {
        this.write(tag("testcase", attrs, true));
      }
    };
    function tag(name, attrs, close, content) {
      var end = close ? "/>" : ">";
      var pairs = [];
      var tag2;
      for (var key in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, key)) {
          pairs.push(key + '="' + escape(attrs[key]) + '"');
        }
      }
      tag2 = "<" + name + (pairs.length ? " " + pairs.join(" ") : "") + end;
      if (content) {
        tag2 += content + "</" + name + end;
      }
      return tag2;
    }
    function testFilePath(filepath, options) {
      if (options && options.reporterOptions && options.reporterOptions.showRelativePaths) {
        return path2.relative(process.cwd(), filepath);
      }
      return filepath;
    }
    XUnit.description = "XUnit-compatible XML output";
  }
});

// node_modules/mocha/lib/reporters/markdown.js
var require_markdown = __commonJS({
  "node_modules/mocha/lib/reporters/markdown.js"(exports2, module2) {
    "use strict";
    var Base = require_base2();
    var utils = require_utils();
    var constants = require_runner().constants;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    var EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
    var EVENT_SUITE_END = constants.EVENT_SUITE_END;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var SUITE_PREFIX = "$";
    exports2 = module2.exports = Markdown;
    function Markdown(runner, options) {
      Base.call(this, runner, options);
      var level = 0;
      var buf = "";
      function title(str) {
        return Array(level).join("#") + " " + str;
      }
      function mapTOC(suite, obj) {
        var ret = obj;
        var key = SUITE_PREFIX + suite.title;
        obj = obj[key] = obj[key] || { suite };
        suite.suites.forEach(function(suite2) {
          mapTOC(suite2, obj);
        });
        return ret;
      }
      function stringifyTOC(obj, level2) {
        ++level2;
        var buf2 = "";
        var link;
        for (var key in obj) {
          if (key === "suite") {
            continue;
          }
          if (key !== SUITE_PREFIX) {
            link = " - [" + key.substring(1) + "]";
            link += "(#" + utils.slug(obj[key].suite.fullTitle()) + ")\n";
            buf2 += Array(level2).join("  ") + link;
          }
          buf2 += stringifyTOC(obj[key], level2);
        }
        return buf2;
      }
      function generateTOC(suite) {
        var obj = mapTOC(suite, {});
        return stringifyTOC(obj, 0);
      }
      generateTOC(runner.suite);
      runner.on(EVENT_SUITE_BEGIN, function(suite) {
        ++level;
        var slug = utils.slug(suite.fullTitle());
        buf += '<a name="' + slug + '"></a>\n';
        buf += title(suite.title) + "\n";
      });
      runner.on(EVENT_SUITE_END, function() {
        --level;
      });
      runner.on(EVENT_TEST_PASS, function(test) {
        var code = utils.clean(test.body);
        buf += test.title + ".\n";
        buf += "\n```js\n";
        buf += code + "\n";
        buf += "```\n\n";
      });
      runner.once(EVENT_RUN_END, function() {
        process.stdout.write("# TOC\n");
        process.stdout.write(generateTOC(runner.suite));
        process.stdout.write(buf);
      });
    }
    Markdown.description = "GitHub Flavored Markdown";
  }
});

// node_modules/mocha/lib/reporters/progress.js
var require_progress = __commonJS({
  "node_modules/mocha/lib/reporters/progress.js"(exports2, module2) {
    "use strict";
    var Base = require_base2();
    var constants = require_runner().constants;
    var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    var EVENT_TEST_END = constants.EVENT_TEST_END;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    var inherits = require_utils().inherits;
    var color = Base.color;
    var cursor = Base.cursor;
    exports2 = module2.exports = Progress;
    Base.colors.progress = 90;
    function Progress(runner, options) {
      Base.call(this, runner, options);
      var self2 = this;
      var width = Base.window.width * 0.5 | 0;
      var total = runner.total;
      var complete = 0;
      var lastN = -1;
      options = options || {};
      var reporterOptions = options.reporterOptions || {};
      options.open = reporterOptions.open || "[";
      options.complete = reporterOptions.complete || "\u25AC";
      options.incomplete = reporterOptions.incomplete || Base.symbols.dot;
      options.close = reporterOptions.close || "]";
      options.verbose = reporterOptions.verbose || false;
      runner.on(EVENT_RUN_BEGIN, function() {
        process.stdout.write("\n");
        cursor.hide();
      });
      runner.on(EVENT_TEST_END, function() {
        complete++;
        var percent = complete / total;
        var n = width * percent | 0;
        var i = width - n;
        if (n === lastN && !options.verbose) {
          return;
        }
        lastN = n;
        cursor.CR();
        process.stdout.write("\x1B[J");
        process.stdout.write(color("progress", "  " + options.open));
        process.stdout.write(Array(n).join(options.complete));
        process.stdout.write(Array(i).join(options.incomplete));
        process.stdout.write(color("progress", options.close));
        if (options.verbose) {
          process.stdout.write(color("progress", " " + complete + " of " + total));
        }
      });
      runner.once(EVENT_RUN_END, function() {
        cursor.show();
        process.stdout.write("\n");
        self2.epilogue();
      });
    }
    inherits(Progress, Base);
    Progress.description = "a progress bar";
  }
});

// node_modules/mocha/lib/reporters/landing.js
var require_landing = __commonJS({
  "node_modules/mocha/lib/reporters/landing.js"(exports2, module2) {
    "use strict";
    var Base = require_base2();
    var inherits = require_utils().inherits;
    var constants = require_runner().constants;
    var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    var EVENT_TEST_END = constants.EVENT_TEST_END;
    var STATE_FAILED = require_runnable().constants.STATE_FAILED;
    var cursor = Base.cursor;
    var color = Base.color;
    exports2 = module2.exports = Landing;
    Base.colors.plane = 0;
    Base.colors["plane crash"] = 31;
    Base.colors.runway = 90;
    function Landing(runner, options) {
      Base.call(this, runner, options);
      var self2 = this;
      var width = Base.window.width * 0.75 | 0;
      var stream = process.stdout;
      var plane = color("plane", "\u2708");
      var crashed = -1;
      var n = 0;
      var total = 0;
      function runway() {
        var buf = Array(width).join("-");
        return "  " + color("runway", buf);
      }
      runner.on(EVENT_RUN_BEGIN, function() {
        stream.write("\n\n\n  ");
        cursor.hide();
      });
      runner.on(EVENT_TEST_END, function(test) {
        var col = crashed === -1 ? width * ++n / ++total | 0 : crashed;
        if (test.state === STATE_FAILED) {
          plane = color("plane crash", "\u2708");
          crashed = col;
        }
        stream.write("\x1B[" + (width + 1) + "D\x1B[2A");
        stream.write(runway());
        stream.write("\n  ");
        stream.write(color("runway", Array(col).join("\u22C5")));
        stream.write(plane);
        stream.write(color("runway", Array(width - col).join("\u22C5") + "\n"));
        stream.write(runway());
        stream.write("\x1B[0m");
      });
      runner.once(EVENT_RUN_END, function() {
        cursor.show();
        process.stdout.write("\n");
        self2.epilogue();
      });
      process.once("SIGINT", function() {
        cursor.show();
        process.nextTick(function() {
          process.kill(process.pid, "SIGINT");
        });
      });
    }
    inherits(Landing, Base);
    Landing.description = "Unicode landing strip";
  }
});

// node_modules/mocha/lib/reporters/json-stream.js
var require_json_stream = __commonJS({
  "node_modules/mocha/lib/reporters/json-stream.js"(exports2, module2) {
    "use strict";
    var Base = require_base2();
    var constants = require_runner().constants;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    exports2 = module2.exports = JSONStream;
    function JSONStream(runner, options) {
      Base.call(this, runner, options);
      var self2 = this;
      var total = runner.total;
      runner.once(EVENT_RUN_BEGIN, function() {
        writeEvent(["start", { total }]);
      });
      runner.on(EVENT_TEST_PASS, function(test) {
        writeEvent(["pass", clean(test)]);
      });
      runner.on(EVENT_TEST_FAIL, function(test, err) {
        test = clean(test);
        test.err = err.message;
        test.stack = err.stack || null;
        writeEvent(["fail", test]);
      });
      runner.once(EVENT_RUN_END, function() {
        writeEvent(["end", self2.stats]);
      });
    }
    function writeEvent(event) {
      process.stdout.write(JSON.stringify(event) + "\n");
    }
    function clean(test) {
      return {
        title: test.title,
        fullTitle: test.fullTitle(),
        file: test.file,
        duration: test.duration,
        currentRetry: test.currentRetry(),
        speed: test.speed
      };
    }
    JSONStream.description = "newline delimited JSON events";
  }
});

// node_modules/mocha/lib/reporters/index.js
var require_reporters = __commonJS({
  "node_modules/mocha/lib/reporters/index.js"(exports2) {
    "use strict";
    exports2.Base = exports2.base = require_base2();
    exports2.Dot = exports2.dot = require_dot();
    exports2.Doc = exports2.doc = require_doc();
    exports2.TAP = exports2.tap = require_tap();
    exports2.JSON = exports2.json = require_json2();
    exports2.HTML = exports2.html = require_html();
    exports2.List = exports2.list = require_list();
    exports2.Min = exports2.min = require_min();
    exports2.Spec = exports2.spec = require_spec();
    exports2.Nyan = exports2.nyan = require_nyan();
    exports2.XUnit = exports2.xunit = require_xunit();
    exports2.Markdown = exports2.markdown = require_markdown();
    exports2.Progress = exports2.progress = require_progress();
    exports2.Landing = exports2.landing = require_landing();
    exports2.JSONStream = exports2["json-stream"] = require_json_stream();
  }
});

// node_modules/mocha/lib/mocharc.json
var require_mocharc = __commonJS({
  "node_modules/mocha/lib/mocharc.json"(exports2, module2) {
    module2.exports = {
      diff: true,
      extension: ["js", "cjs", "mjs"],
      package: "./package.json",
      reporter: "spec",
      slow: 75,
      timeout: 2e3,
      ui: "bdd",
      "watch-ignore": ["node_modules", ".git"]
    };
  }
});

// node_modules/mocha/lib/nodejs/esm-utils.js
var require_esm_utils = __commonJS({
  "node_modules/mocha/lib/nodejs/esm-utils.js"(exports2) {
    var path2 = require("node:path");
    var url = require("node:url");
    var debug = require_src()("mocha:esm-utils");
    var forward = (x) => x;
    var formattedImport = async (file, esmDecorator = forward) => {
      if (path2.isAbsolute(file)) {
        try {
          return await exports2.doImport(esmDecorator(url.pathToFileURL(file)));
        } catch (err) {
          if (err instanceof SyntaxError && err.message && err.stack && !err.stack.includes(file)) {
            const newErrorWithFilename = new SyntaxError(err.message);
            newErrorWithFilename.stack = err.stack.replace(
              /^SyntaxError/,
              `SyntaxError[ @${file} ]`
            );
            throw newErrorWithFilename;
          }
          throw err;
        }
      }
      return exports2.doImport(esmDecorator(file));
    };
    exports2.doImport = async (file) => import(file);
    var tryImportAndRequire = async (file, esmDecorator) => {
      if (path2.extname(file) === ".mjs") {
        return formattedImport(file, esmDecorator);
      }
      try {
        return dealWithExports(await formattedImport(file, esmDecorator));
      } catch (err) {
        if (err.code === "ERR_MODULE_NOT_FOUND" || err.code === "ERR_UNKNOWN_FILE_EXTENSION" || err.code === "ERR_UNSUPPORTED_DIR_IMPORT") {
          try {
            return require(file);
          } catch (requireErr) {
            if (requireErr.code === "ERR_REQUIRE_ESM" || requireErr instanceof SyntaxError && requireErr.toString().includes("Cannot use import statement outside a module")) {
              throw err;
            } else {
              throw requireErr;
            }
          }
        } else {
          throw err;
        }
      }
    };
    var requireModule = async (file, esmDecorator) => {
      if (path2.extname(file) === ".mjs") {
        return formattedImport(file, esmDecorator);
      }
      try {
        return require(file);
      } catch (requireErr) {
        debug("requireModule caught err: %O", requireErr.message);
        try {
          return dealWithExports(await formattedImport(file, esmDecorator));
        } catch (importErr) {
          if (/\.(cts|mts|ts)$/.test(file) && importErr.code === "ERR_UNKNOWN_FILE_EXTENSION") {
            throw requireErr;
          }
          if (importErr.code === "ERR_INTERNAL_ASSERTION") {
            throw requireErr;
          }
          throw importErr;
        }
      }
    };
    debug(
      "assigning requireOrImport, require_module === %O",
      process.features.require_module
    );
    if (process.features.require_module) {
      exports2.requireOrImport = requireModule;
    } else {
      exports2.requireOrImport = tryImportAndRequire;
    }
    function dealWithExports(module3) {
      if (module3.default) {
        return module3.default;
      } else {
        return { ...module3, default: void 0 };
      }
    }
    exports2.loadFilesAsync = async (files, preLoadFunc, postLoadFunc, esmDecorator) => {
      for (const file of files) {
        preLoadFunc(file);
        const result = await exports2.requireOrImport(
          path2.resolve(file),
          esmDecorator
        );
        postLoadFunc(file, result);
      }
    };
  }
});

// node_modules/mocha/lib/stats-collector.js
var require_stats_collector = __commonJS({
  "node_modules/mocha/lib/stats-collector.js"(exports2, module2) {
    "use strict";
    var constants = require_runner().constants;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
    var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    var EVENT_TEST_END = constants.EVENT_TEST_END;
    var Date2 = global.Date;
    function createStatsCollector(runner) {
      var stats = {
        suites: 0,
        tests: 0,
        passes: 0,
        pending: 0,
        failures: 0
      };
      if (!runner) {
        throw new TypeError("Missing runner argument");
      }
      runner.stats = stats;
      runner.once(EVENT_RUN_BEGIN, function() {
        stats.start = new Date2();
      });
      runner.on(EVENT_SUITE_BEGIN, function(suite) {
        suite.root || stats.suites++;
      });
      runner.on(EVENT_TEST_PASS, function() {
        stats.passes++;
      });
      runner.on(EVENT_TEST_FAIL, function() {
        stats.failures++;
      });
      runner.on(EVENT_TEST_PENDING, function() {
        stats.pending++;
      });
      runner.on(EVENT_TEST_END, function() {
        stats.tests++;
      });
      runner.once(EVENT_RUN_END, function() {
        stats.end = new Date2();
        stats.duration = stats.end - stats.start;
      });
    }
    module2.exports = createStatsCollector;
  }
});

// node_modules/mocha/lib/test.js
var require_test = __commonJS({
  "node_modules/mocha/lib/test.js"(exports2, module2) {
    "use strict";
    var Runnable = require_runnable();
    var utils = require_utils();
    var errors = require_errors();
    var createInvalidArgumentTypeError = errors.createInvalidArgumentTypeError;
    var isString = utils.isString;
    var { MOCHA_ID_PROP_NAME } = utils.constants;
    module2.exports = Test;
    function Test(title, fn) {
      if (!isString(title)) {
        throw createInvalidArgumentTypeError(
          'Test argument "title" should be a string. Received type "' + typeof title + '"',
          "title",
          "string"
        );
      }
      this.type = "test";
      Runnable.call(this, title, fn);
      this.reset();
    }
    utils.inherits(Test, Runnable);
    Test.prototype.reset = function() {
      Runnable.prototype.reset.call(this);
      this.pending = !this.fn;
      delete this.state;
    };
    Test.prototype.retriedTest = function(n) {
      if (!arguments.length) {
        return this._retriedTest;
      }
      this._retriedTest = n;
    };
    Test.prototype.markOnly = function() {
      this.parent.appendOnlyTest(this);
    };
    Test.prototype.clone = function() {
      var test = new Test(this.title, this.fn);
      test.timeout(this.timeout());
      test.slow(this.slow());
      test.retries(this.retries());
      test.currentRetry(this.currentRetry());
      test.retriedTest(this.retriedTest() || this);
      test.globals(this.globals());
      test.parent = this.parent;
      test.file = this.file;
      test.ctx = this.ctx;
      return test;
    };
    Test.prototype.serialize = function serialize() {
      return {
        $$currentRetry: this._currentRetry,
        $$fullTitle: this.fullTitle(),
        $$isPending: Boolean(this.pending),
        $$retriedTest: this._retriedTest || null,
        $$slow: this._slow,
        $$titlePath: this.titlePath(),
        body: this.body,
        duration: this.duration,
        err: this.err,
        parent: {
          $$fullTitle: this.parent.fullTitle(),
          [MOCHA_ID_PROP_NAME]: this.parent.id
        },
        speed: this.speed,
        state: this.state,
        title: this.title,
        type: this.type,
        file: this.file,
        [MOCHA_ID_PROP_NAME]: this.id
      };
    };
  }
});

// node_modules/mocha/lib/interfaces/common.js
var require_common2 = __commonJS({
  "node_modules/mocha/lib/interfaces/common.js"(exports2, module2) {
    "use strict";
    var Suite = require_suite();
    var errors = require_errors();
    var createMissingArgumentError = errors.createMissingArgumentError;
    var createUnsupportedError = errors.createUnsupportedError;
    var createForbiddenExclusivityError = errors.createForbiddenExclusivityError;
    module2.exports = function(suites, context, mocha) {
      function shouldBeTested(suite) {
        return !mocha.options.grep || mocha.options.grep && mocha.options.grep.test(suite.fullTitle()) && !mocha.options.invert;
      }
      return {
        /**
         * This is only present if flag --delay is passed into Mocha. It triggers
         * root suite execution.
         *
         * @param {Suite} suite The root suite.
         * @return {Function} A function which runs the root suite
         */
        runWithSuite: function runWithSuite(suite) {
          return function run2() {
            suite.run();
          };
        },
        /**
         * Execute before running tests.
         *
         * @param {string} name
         * @param {Function} fn
         */
        before: function(name, fn) {
          return suites[0].beforeAll(name, fn);
        },
        /**
         * Execute after running tests.
         *
         * @param {string} name
         * @param {Function} fn
         */
        after: function(name, fn) {
          return suites[0].afterAll(name, fn);
        },
        /**
         * Execute before each test case.
         *
         * @param {string} name
         * @param {Function} fn
         */
        beforeEach: function(name, fn) {
          return suites[0].beforeEach(name, fn);
        },
        /**
         * Execute after each test case.
         *
         * @param {string} name
         * @param {Function} fn
         */
        afterEach: function(name, fn) {
          return suites[0].afterEach(name, fn);
        },
        suite: {
          /**
           * Create an exclusive Suite; convenience function
           * See docstring for create() below.
           *
           * @param {Object} opts
           * @returns {Suite}
           */
          only: function only(opts) {
            if (mocha.options.forbidOnly) {
              throw createForbiddenExclusivityError(mocha);
            }
            opts.isOnly = true;
            return this.create(opts);
          },
          /**
           * Create a Suite, but skip it; convenience function
           * See docstring for create() below.
           *
           * @param {Object} opts
           * @returns {Suite}
           */
          skip: function skip(opts) {
            opts.pending = true;
            return this.create(opts);
          },
          /**
           * Creates a suite.
           *
           * @param {Object} opts Options
           * @param {string} opts.title Title of Suite
           * @param {Function} [opts.fn] Suite Function (not always applicable)
           * @param {boolean} [opts.pending] Is Suite pending?
           * @param {string} [opts.file] Filepath where this Suite resides
           * @param {boolean} [opts.isOnly] Is Suite exclusive?
           * @returns {Suite}
           */
          create: function create(opts) {
            var suite = Suite.create(suites[0], opts.title);
            suite.pending = Boolean(opts.pending);
            suite.file = opts.file;
            suites.unshift(suite);
            if (opts.isOnly) {
              suite.markOnly();
            }
            if (suite.pending && mocha.options.forbidPending && shouldBeTested(suite)) {
              throw createUnsupportedError("Pending test forbidden");
            }
            if (typeof opts.fn === "function") {
              opts.fn.call(suite);
              suites.shift();
            } else if (typeof opts.fn === "undefined" && !suite.pending) {
              throw createMissingArgumentError(
                'Suite "' + suite.fullTitle() + '" was defined but no callback was supplied. Supply a callback or explicitly skip the suite.',
                "callback",
                "function"
              );
            } else if (!opts.fn && suite.pending) {
              suites.shift();
            }
            return suite;
          }
        },
        test: {
          /**
           * Exclusive test-case.
           *
           * @param {Object} mocha
           * @param {Function} test
           * @returns {*}
           */
          only: function(mocha2, test) {
            if (mocha2.options.forbidOnly) {
              throw createForbiddenExclusivityError(mocha2);
            }
            test.markOnly();
            return test;
          },
          /**
           * Pending test case.
           *
           * @param {string} title
           */
          skip: function(title) {
            context.test(title);
          }
        }
      };
    };
  }
});

// node_modules/mocha/lib/interfaces/bdd.js
var require_bdd = __commonJS({
  "node_modules/mocha/lib/interfaces/bdd.js"(exports2, module2) {
    "use strict";
    var Test = require_test();
    var EVENT_FILE_PRE_REQUIRE = require_suite().constants.EVENT_FILE_PRE_REQUIRE;
    module2.exports = function bddInterface(suite) {
      var suites = [suite];
      suite.on(EVENT_FILE_PRE_REQUIRE, function(context, file, mocha) {
        var common = require_common2()(suites, context, mocha);
        context.before = common.before;
        context.after = common.after;
        context.beforeEach = common.beforeEach;
        context.afterEach = common.afterEach;
        context.run = mocha.options.delay && common.runWithSuite(suite);
        context.describe = context.context = function(title, fn) {
          return common.suite.create({
            title,
            file,
            fn
          });
        };
        context.xdescribe = context.xcontext = context.describe.skip = function(title, fn) {
          return common.suite.skip({
            title,
            file,
            fn
          });
        };
        context.describe.only = function(title, fn) {
          return common.suite.only({
            title,
            file,
            fn
          });
        };
        context.it = context.specify = function(title, fn) {
          var suite2 = suites[0];
          if (suite2.isPending()) {
            fn = null;
          }
          var test = new Test(title, fn);
          test.file = file;
          suite2.addTest(test);
          return test;
        };
        context.it.only = function(title, fn) {
          return common.test.only(mocha, context.it(title, fn));
        };
        context.xit = context.xspecify = context.it.skip = function(title) {
          return context.it(title);
        };
      });
    };
    module2.exports.description = "BDD or RSpec style [default]";
  }
});

// node_modules/mocha/lib/interfaces/tdd.js
var require_tdd = __commonJS({
  "node_modules/mocha/lib/interfaces/tdd.js"(exports2, module2) {
    "use strict";
    var Test = require_test();
    var EVENT_FILE_PRE_REQUIRE = require_suite().constants.EVENT_FILE_PRE_REQUIRE;
    module2.exports = function(suite) {
      var suites = [suite];
      suite.on(EVENT_FILE_PRE_REQUIRE, function(context, file, mocha) {
        var common = require_common2()(suites, context, mocha);
        context.setup = common.beforeEach;
        context.teardown = common.afterEach;
        context.suiteSetup = common.before;
        context.suiteTeardown = common.after;
        context.run = mocha.options.delay && common.runWithSuite(suite);
        context.suite = function(title, fn) {
          return common.suite.create({
            title,
            file,
            fn
          });
        };
        context.suite.skip = function(title, fn) {
          return common.suite.skip({
            title,
            file,
            fn
          });
        };
        context.suite.only = function(title, fn) {
          return common.suite.only({
            title,
            file,
            fn
          });
        };
        context.test = function(title, fn) {
          var suite2 = suites[0];
          if (suite2.isPending()) {
            fn = null;
          }
          var test = new Test(title, fn);
          test.file = file;
          suite2.addTest(test);
          return test;
        };
        context.test.only = function(title, fn) {
          return common.test.only(mocha, context.test(title, fn));
        };
        context.test.skip = common.test.skip;
      });
    };
    module2.exports.description = `traditional "suite"/"test" instead of BDD's "describe"/"it"`;
  }
});

// node_modules/mocha/lib/interfaces/qunit.js
var require_qunit = __commonJS({
  "node_modules/mocha/lib/interfaces/qunit.js"(exports2, module2) {
    "use strict";
    var Test = require_test();
    var EVENT_FILE_PRE_REQUIRE = require_suite().constants.EVENT_FILE_PRE_REQUIRE;
    module2.exports = function qUnitInterface(suite) {
      var suites = [suite];
      suite.on(EVENT_FILE_PRE_REQUIRE, function(context, file, mocha) {
        var common = require_common2()(suites, context, mocha);
        context.before = common.before;
        context.after = common.after;
        context.beforeEach = common.beforeEach;
        context.afterEach = common.afterEach;
        context.run = mocha.options.delay && common.runWithSuite(suite);
        context.suite = function(title) {
          if (suites.length > 1) {
            suites.shift();
          }
          return common.suite.create({
            title,
            file,
            fn: false
          });
        };
        context.suite.only = function(title) {
          if (suites.length > 1) {
            suites.shift();
          }
          return common.suite.only({
            title,
            file,
            fn: false
          });
        };
        context.test = function(title, fn) {
          var test = new Test(title, fn);
          test.file = file;
          suites[0].addTest(test);
          return test;
        };
        context.test.only = function(title, fn) {
          return common.test.only(mocha, context.test(title, fn));
        };
        context.test.skip = common.test.skip;
      });
    };
    module2.exports.description = "QUnit style";
  }
});

// node_modules/mocha/lib/interfaces/exports.js
var require_exports = __commonJS({
  "node_modules/mocha/lib/interfaces/exports.js"(exports2, module2) {
    "use strict";
    var Suite = require_suite();
    var Test = require_test();
    module2.exports = function(suite) {
      var suites = [suite];
      suite.on(Suite.constants.EVENT_FILE_REQUIRE, visit);
      function visit(obj, file) {
        var suite2;
        for (var key in obj) {
          if (typeof obj[key] === "function") {
            var fn = obj[key];
            switch (key) {
              case "before":
                suites[0].beforeAll(fn);
                break;
              case "after":
                suites[0].afterAll(fn);
                break;
              case "beforeEach":
                suites[0].beforeEach(fn);
                break;
              case "afterEach":
                suites[0].afterEach(fn);
                break;
              default:
                var test = new Test(key, fn);
                test.file = file;
                suites[0].addTest(test);
            }
          } else {
            suite2 = Suite.create(suites[0], key);
            suites.unshift(suite2);
            visit(obj[key], file);
            suites.shift();
          }
        }
      }
    };
    module2.exports.description = 'Node.js module ("exports") style';
  }
});

// node_modules/mocha/lib/interfaces/index.js
var require_interfaces = __commonJS({
  "node_modules/mocha/lib/interfaces/index.js"(exports2) {
    "use strict";
    exports2.bdd = require_bdd();
    exports2.tdd = require_tdd();
    exports2.qunit = require_qunit();
    exports2.exports = require_exports();
  }
});

// node_modules/mocha/lib/context.js
var require_context = __commonJS({
  "node_modules/mocha/lib/context.js"(exports2, module2) {
    "use strict";
    module2.exports = Context;
    function Context() {
    }
    Context.prototype.runnable = function(runnable) {
      if (!arguments.length) {
        return this._runnable;
      }
      this.test = this._runnable = runnable;
      return this;
    };
    Context.prototype.timeout = function(ms) {
      if (!arguments.length) {
        return this.runnable().timeout();
      }
      this.runnable().timeout(ms);
      return this;
    };
    Context.prototype.slow = function(ms) {
      if (!arguments.length) {
        return this.runnable().slow();
      }
      this.runnable().slow(ms);
      return this;
    };
    Context.prototype.skip = function() {
      this.runnable().skip();
    };
    Context.prototype.retries = function(n) {
      if (!arguments.length) {
        return this.runnable().retries();
      }
      this.runnable().retries(n);
      return this;
    };
  }
});

// node_modules/mocha/lib/nodejs/file-unloader.js
var require_file_unloader = __commonJS({
  "node_modules/mocha/lib/nodejs/file-unloader.js"(exports2) {
    "use strict";
    exports2.unloadFile = (file) => {
      delete require.cache[require.resolve(file)];
    };
  }
});

// node_modules/mocha/package.json
var require_package = __commonJS({
  "node_modules/mocha/package.json"(exports2, module2) {
    module2.exports = {
      name: "mocha",
      version: "11.7.6",
      type: "commonjs",
      description: "simple, flexible, fun test framework",
      keywords: [
        "mocha",
        "test",
        "bdd",
        "tdd",
        "tap",
        "testing",
        "chai",
        "assertion",
        "ava",
        "jest",
        "tape",
        "jasmine",
        "karma"
      ],
      author: "TJ Holowaychuk <tj@vision-media.ca>",
      license: "MIT",
      repository: {
        type: "git",
        url: "https://github.com/mochajs/mocha.git"
      },
      bugs: {
        url: "https://github.com/mochajs/mocha/issues/"
      },
      discord: "https://discord.gg/KeDn2uXhER",
      homepage: "https://mochajs.org/",
      logo: "https://cldup.com/S9uQ-cOLYz.svg",
      notifyLogo: "https://ibin.co/4QuRuGjXvl36.png",
      bin: {
        mocha: "./bin/mocha.js",
        _mocha: "./bin/_mocha"
      },
      directories: {
        lib: "./lib",
        test: "./test"
      },
      engines: {
        node: "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      scripts: {
        build: "rollup -c ./rollup.config.js",
        clean: "rimraf mocha.js mocha.js.map",
        "docs-clean": "rimraf docs/_site docs/api",
        "docs-watch": "eleventy --serve",
        "docs:api": "jsdoc -c jsdoc.conf.json",
        "docs:build": "eleventy",
        "docs:build-new": "cd docs-next && npm i && npm run build-with-old",
        "docs:preview": "http-server docs/_site -o",
        docs: "run-s docs-clean docs:api docs:build docs:build-new",
        "format:check": "prettier --check .",
        "format:fix": "prettier --write .",
        "lint:installed-check": "installed-check --engine-check",
        "lint:knip": "knip --cache",
        "lint:code": 'eslint . "bin/*" --max-warnings 0',
        "lint:markdown": 'markdownlint "*.md" "docs/**/*.md" ".github/*.md" "lib/**/*.md" "test/**/*.md" "example/**/*.md" -i CHANGELOG.md',
        lint: "run-p lint:*",
        prepublishOnly: "run-s clean build version",
        "test-browser-run": "cross-env NODE_PATH=. karma start ./karma.conf.js --single-run",
        "test-browser:reporters:bdd": "cross-env MOCHA_TEST=bdd npm run -s test-browser-run",
        "test-browser:reporters:esm": "cross-env MOCHA_TEST=esm npm run -s test-browser-run",
        "test-browser:reporters:qunit": "cross-env MOCHA_TEST=qunit npm run -s test-browser-run",
        "test-browser:reporters:tdd": "cross-env MOCHA_TEST=tdd npm run -s test-browser-run",
        "test-browser:reporters": "run-s test-browser:reporters:*",
        "test-browser:webpack-compat": "webpack --mode development --config ./test/browser-specific/fixtures/webpack/webpack.config.js",
        "test-browser": "run-s clean build test-browser:*",
        "test-coverage-clean": "rimraf .nyc_output coverage",
        "test-coverage-generate": "nyc report --reporter=lcov --reporter=text",
        "test-node-run-only": "nyc --no-clean --reporter=json node bin/mocha.js",
        "test-node-run": "nyc --no-clean --reporter=json node bin/mocha.js --forbid-only",
        "test-node-run:bare": "node bin/mocha.js --grep @bare",
        "test-node:integration": 'run-s clean build && npm run -s test-node-run -- --parallel --timeout 10000 --slow 3750 "test/integration/**/*.spec.js"',
        "test-node:integration:bare": 'run-s clean build && npm run -s test-node-run:bare -- --parallel --timeout 10000 --slow 3750 "test/integration/**/*.spec.js"',
        "test-node:integration:watch": 'run-s clean build && npm run -s test-node-run -- --parallel --timeout 10000 --slow 3750 "test/integration/options/watch.spec.js"',
        "test-node:interfaces:bdd": "npm run -s test-node-run -- --ui bdd test/interfaces/bdd.spec",
        "test-node:interfaces:exports": "npm run -s test-node-run -- --ui exports test/interfaces/exports.spec",
        "test-node:interfaces:qunit": "npm run -s test-node-run -- --ui qunit test/interfaces/qunit.spec",
        "test-node:interfaces:tdd": "npm run -s test-node-run -- --ui tdd test/interfaces/tdd.spec",
        "test-node:interfaces": "run-p test-node:interfaces:*",
        "test-node:jsapi": "node test/jsapi/index.js",
        "test-node:only:bddRequire": "npm run -s test-node-run-only -- --ui qunit test/only/bdd-require.spec --no-parallel",
        "test-node:only:globalBdd": "npm run -s test-node-run-only -- --ui bdd test/only/global/bdd.spec --no-parallel",
        "test-node:only:globalQunit": "npm run -s test-node-run-only -- --ui qunit test/only/global/qunit.spec --no-parallel",
        "test-node:only:globalTdd": "npm run -s test-node-run-only -- --ui tdd test/only/global/tdd.spec --no-parallel",
        "test-node:only": "run-p test-node:only:*",
        "test-node:reporters": 'npm run -s test-node-run -- "test/reporters/*.spec.js"',
        "test-node:requires": "npm run -s test-node-run -- --require coffeescript/register --require test/require/a.js --require test/require/b.coffee --require test/require/c.js --require test/require/d.coffee test/require/require.spec.js",
        "test-node:unit": 'npm run -s test-node-run -- "test/unit/*.spec.js" "test/node-unit/**/*.spec.js"',
        "test-node": "run-s test-coverage-clean test-node:* test-coverage-generate",
        "test-smoke": "node ./bin/mocha --no-config test/smoke/smoke.spec.js",
        test: "run-s lint test-node test-browser",
        tsc: "tsc",
        "version:linkify-changelog": "node scripts/linkify-changelog.mjs",
        "version:update-authors": "node scripts/update-authors.js",
        version: "run-p version:* && git add -A ./AUTHORS ./CHANGELOG.md"
      },
      dependencies: {
        "browser-stdout": "^1.3.1",
        chokidar: "^4.0.1",
        debug: "^4.3.5",
        diff: "^7.0.0",
        "escape-string-regexp": "^4.0.0",
        "find-up": "^5.0.0",
        glob: "^10.4.5",
        he: "^1.2.0",
        "is-path-inside": "^3.0.3",
        "js-yaml": "^4.1.0",
        "log-symbols": "^4.1.0",
        minimatch: "^9.0.5",
        ms: "^2.1.3",
        picocolors: "^1.1.1",
        "serialize-javascript": "^6.0.2",
        "strip-json-comments": "^3.1.1",
        "supports-color": "^8.1.1",
        workerpool: "^9.2.0",
        yargs: "^17.7.2",
        "yargs-parser": "^21.1.1",
        "yargs-unparser": "^2.0.0"
      },
      devDependencies: {
        "@11ty/eleventy": "^1.0.0",
        "@11ty/eleventy-plugin-inclusive-language": "^1.0.3",
        "@eslint/js": "^8.56.0",
        "@mocha/docdash": "^4.0.1",
        "@rollup/plugin-alias": "^5.1.1",
        "@rollup/plugin-commonjs": "^21.0.2",
        "@rollup/plugin-json": "^4.1.0",
        "@rollup/plugin-multi-entry": "^4.0.1",
        "@rollup/plugin-node-resolve": "^13.1.3",
        "@test/esm-only-loader": "./test/compiler-fixtures/esm-only-loader",
        "@types/node": "^22.15.3",
        "@types/yargs": "^17.0.33",
        "@vscode/windows-process-tree": "^0.6.3",
        chai: "^4.3.4",
        coffeescript: "^2.6.1",
        "cross-env": "^7.0.2",
        eslint: "^8.56.0",
        "eslint-plugin-n": "^17.15.1",
        "fail-on-errors-webpack-plugin": "^3.0.0",
        globals: "^13.24.0",
        "http-server": "^14.1.1",
        "installed-check": "^9.3.0",
        jsdoc: "^3.6.7",
        "jsdoc-ts-utils": "^2.0.1",
        karma: "^6.4.2",
        "karma-chrome-launcher": "^3.2.0",
        "karma-mocha": "^2.0.1",
        "karma-mocha-reporter": "^2.2.5",
        "karma-sauce-launcher": "^4.3.6",
        knip: "^5.61.3",
        "markdown-it": "^12.3.2",
        "markdown-it-anchor": "^8.4.1",
        "markdown-it-attrs": "^4.1.3",
        "markdown-it-emoji": "^2.0.0",
        "markdown-it-prism": "^2.2.2",
        "markdown-toc": "^1.2.0",
        "markdownlint-cli": "^0.30.0",
        needle: "^2.5.0",
        "npm-run-all2": "^6.2.0",
        nyc: "^15.1.0",
        pidtree: "^0.5.0",
        prettier: "3.6.2",
        remark: "^14.0.2",
        "remark-github": "^11.2.2",
        "remark-inline-links": "^6.0.1",
        rewiremock: "^3.14.3",
        rimraf: "^3.0.2",
        rollup: "^2.70.1",
        "rollup-plugin-node-globals": "^1.4.0",
        "rollup-plugin-polyfill-node": "^0.8.0",
        "rollup-plugin-visualizer": "^5.6.0",
        semver: "^7.7.2",
        sinon: "^9.0.3",
        typescript: "^5.8.3",
        unexpected: "^11.14.0",
        "unexpected-eventemitter": "^2.2.0",
        "unexpected-map": "^2.0.0",
        "unexpected-set": "^3.0.0",
        "unexpected-sinon": "^10.11.2",
        uslug: "^1.0.4",
        webpack: "^5.67.0",
        "webpack-cli": "^4.9.1"
      },
      files: [
        "bin/*mocha*",
        "lib/**/*.{js,html,json}",
        "index.js",
        "mocha.css",
        "mocha.js",
        "mocha.js.map",
        "browser-entry.js"
      ],
      browser: {
        "./index.js": "./browser-entry.js",
        fs: false,
        path: false,
        "supports-color": false,
        "./lib/nodejs/buffered-worker-pool.js": false,
        "./lib/nodejs/esm-utils.js": false,
        "./lib/nodejs/file-unloader.js": false,
        "./lib/nodejs/parallel-buffered-runner.js": false,
        "./lib/nodejs/serializer.js": false,
        "./lib/nodejs/worker.js": false,
        "./lib/nodejs/reporters/parallel-buffered.js": false,
        "./lib/cli/index.js": false
      },
      overrides: {
        "@types/eslint": "^9.6.1",
        "@types/estree": "^1.0.7",
        webdriverio: "^7.33.0"
      }
    };
  }
});

// node_modules/randombytes/index.js
var require_randombytes = __commonJS({
  "node_modules/randombytes/index.js"(exports2, module2) {
    module2.exports = require("crypto").randomBytes;
  }
});

// node_modules/serialize-javascript/index.js
var require_serialize_javascript = __commonJS({
  "node_modules/serialize-javascript/index.js"(exports2, module2) {
    "use strict";
    var randomBytes = require_randombytes();
    var UID_LENGTH = 16;
    var UID = generateUID();
    var PLACE_HOLDER_REGEXP = new RegExp('(\\\\)?"@__(F|R|D|M|S|A|U|I|B|L)-' + UID + '-(\\d+)__@"', "g");
    var IS_NATIVE_CODE_REGEXP = /\{\s*\[native code\]\s*\}/g;
    var IS_PURE_FUNCTION = /function.*?\(/;
    var IS_ARROW_FUNCTION = /.*?=>.*?/;
    var UNSAFE_CHARS_REGEXP = /[<>\/\u2028\u2029]/g;
    var RESERVED_SYMBOLS = ["*", "async"];
    var ESCAPED_CHARS = {
      "<": "\\u003C",
      ">": "\\u003E",
      "/": "\\u002F",
      "\u2028": "\\u2028",
      "\u2029": "\\u2029"
    };
    function escapeUnsafeChars(unsafeChar) {
      return ESCAPED_CHARS[unsafeChar];
    }
    function generateUID() {
      var bytes = randomBytes(UID_LENGTH);
      var result = "";
      for (var i = 0; i < UID_LENGTH; ++i) {
        result += bytes[i].toString(16);
      }
      return result;
    }
    function deleteFunctions(obj) {
      var functionKeys = [];
      for (var key in obj) {
        if (typeof obj[key] === "function") {
          functionKeys.push(key);
        }
      }
      for (var i = 0; i < functionKeys.length; i++) {
        delete obj[functionKeys[i]];
      }
    }
    module2.exports = function serialize(obj, options) {
      options || (options = {});
      if (typeof options === "number" || typeof options === "string") {
        options = { space: options };
      }
      var functions = [];
      var regexps = [];
      var dates = [];
      var maps = [];
      var sets = [];
      var arrays = [];
      var undefs = [];
      var infinities = [];
      var bigInts = [];
      var urls = [];
      function replacer(key, value) {
        if (options.ignoreFunction) {
          deleteFunctions(value);
        }
        if (!value && value !== void 0 && value !== BigInt(0)) {
          return value;
        }
        var origValue = this[key];
        var type = typeof origValue;
        if (type === "object") {
          if (origValue instanceof RegExp) {
            return "@__R-" + UID + "-" + (regexps.push(origValue) - 1) + "__@";
          }
          if (origValue instanceof Date) {
            return "@__D-" + UID + "-" + (dates.push(origValue) - 1) + "__@";
          }
          if (origValue instanceof Map) {
            return "@__M-" + UID + "-" + (maps.push(origValue) - 1) + "__@";
          }
          if (origValue instanceof Set) {
            return "@__S-" + UID + "-" + (sets.push(origValue) - 1) + "__@";
          }
          if (origValue instanceof Array) {
            var isSparse = origValue.filter(function() {
              return true;
            }).length !== origValue.length;
            if (isSparse) {
              return "@__A-" + UID + "-" + (arrays.push(origValue) - 1) + "__@";
            }
          }
          if (origValue instanceof URL) {
            return "@__L-" + UID + "-" + (urls.push(origValue) - 1) + "__@";
          }
        }
        if (type === "function") {
          return "@__F-" + UID + "-" + (functions.push(origValue) - 1) + "__@";
        }
        if (type === "undefined") {
          return "@__U-" + UID + "-" + (undefs.push(origValue) - 1) + "__@";
        }
        if (type === "number" && !isNaN(origValue) && !isFinite(origValue)) {
          return "@__I-" + UID + "-" + (infinities.push(origValue) - 1) + "__@";
        }
        if (type === "bigint") {
          return "@__B-" + UID + "-" + (bigInts.push(origValue) - 1) + "__@";
        }
        return value;
      }
      function serializeFunc(fn) {
        var serializedFn = fn.toString();
        if (IS_NATIVE_CODE_REGEXP.test(serializedFn)) {
          throw new TypeError("Serializing native function: " + fn.name);
        }
        if (IS_PURE_FUNCTION.test(serializedFn)) {
          return serializedFn;
        }
        if (IS_ARROW_FUNCTION.test(serializedFn)) {
          return serializedFn;
        }
        var argsStartsAt = serializedFn.indexOf("(");
        var def = serializedFn.substr(0, argsStartsAt).trim().split(" ").filter(function(val) {
          return val.length > 0;
        });
        var nonReservedSymbols = def.filter(function(val) {
          return RESERVED_SYMBOLS.indexOf(val) === -1;
        });
        if (nonReservedSymbols.length > 0) {
          return (def.indexOf("async") > -1 ? "async " : "") + "function" + (def.join("").indexOf("*") > -1 ? "*" : "") + serializedFn.substr(argsStartsAt);
        }
        return serializedFn;
      }
      if (options.ignoreFunction && typeof obj === "function") {
        obj = void 0;
      }
      if (obj === void 0) {
        return String(obj);
      }
      var str;
      if (options.isJSON && !options.space) {
        str = JSON.stringify(obj);
      } else {
        str = JSON.stringify(obj, options.isJSON ? null : replacer, options.space);
      }
      if (typeof str !== "string") {
        return String(str);
      }
      if (options.unsafe !== true) {
        str = str.replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars);
      }
      if (functions.length === 0 && regexps.length === 0 && dates.length === 0 && maps.length === 0 && sets.length === 0 && arrays.length === 0 && undefs.length === 0 && infinities.length === 0 && bigInts.length === 0 && urls.length === 0) {
        return str;
      }
      return str.replace(PLACE_HOLDER_REGEXP, function(match, backSlash, type, valueIndex) {
        if (backSlash) {
          return match;
        }
        if (type === "D") {
          return 'new Date("' + dates[valueIndex].toISOString() + '")';
        }
        if (type === "R") {
          return "new RegExp(" + serialize(regexps[valueIndex].source) + ', "' + regexps[valueIndex].flags + '")';
        }
        if (type === "M") {
          return "new Map(" + serialize(Array.from(maps[valueIndex].entries()), options) + ")";
        }
        if (type === "S") {
          return "new Set(" + serialize(Array.from(sets[valueIndex].values()), options) + ")";
        }
        if (type === "A") {
          return "Array.prototype.slice.call(" + serialize(Object.assign({ length: arrays[valueIndex].length }, arrays[valueIndex]), options) + ")";
        }
        if (type === "U") {
          return "undefined";
        }
        if (type === "I") {
          return infinities[valueIndex];
        }
        if (type === "B") {
          return 'BigInt("' + bigInts[valueIndex] + '")';
        }
        if (type === "L") {
          return "new URL(" + serialize(urls[valueIndex].toString(), options) + ")";
        }
        var fn = functions[valueIndex];
        return serializeFunc(fn);
      });
    };
  }
});

// node_modules/workerpool/src/environment.js
var require_environment = __commonJS({
  "node_modules/workerpool/src/environment.js"(exports2, module2) {
    var isNode = function(nodeProcess) {
      return typeof nodeProcess !== "undefined" && nodeProcess.versions != null && nodeProcess.versions.node != null && nodeProcess + "" === "[object process]";
    };
    module2.exports.isNode = isNode;
    module2.exports.platform = typeof process !== "undefined" && isNode(process) ? "node" : "browser";
    var worker_threads = module2.exports.platform === "node" && require("worker_threads");
    module2.exports.isMainThread = module2.exports.platform === "node" ? (!worker_threads || worker_threads.isMainThread) && !process.connected : typeof Window !== "undefined";
    module2.exports.cpus = module2.exports.platform === "browser" ? self.navigator.hardwareConcurrency : require("os").cpus().length;
  }
});

// node_modules/workerpool/src/Promise.js
var require_Promise = __commonJS({
  "node_modules/workerpool/src/Promise.js"(exports2) {
    "use strict";
    function Promise2(handler, parent) {
      var me = this;
      if (!(this instanceof Promise2)) {
        throw new SyntaxError("Constructor must be called with the new operator");
      }
      if (typeof handler !== "function") {
        throw new SyntaxError("Function parameter handler(resolve, reject) missing");
      }
      var _onSuccess = [];
      var _onFail = [];
      this.resolved = false;
      this.rejected = false;
      this.pending = true;
      this[Symbol.toStringTag] = "Promise";
      var _process = function(onSuccess, onFail) {
        _onSuccess.push(onSuccess);
        _onFail.push(onFail);
      };
      this.then = function(onSuccess, onFail) {
        return new Promise2(function(resolve2, reject) {
          var s = onSuccess ? _then(onSuccess, resolve2, reject) : resolve2;
          var f = onFail ? _then(onFail, resolve2, reject) : reject;
          _process(s, f);
        }, me);
      };
      var _resolve = function(result) {
        me.resolved = true;
        me.rejected = false;
        me.pending = false;
        _onSuccess.forEach(function(fn) {
          fn(result);
        });
        _process = function(onSuccess, onFail) {
          onSuccess(result);
        };
        _resolve = _reject = function() {
        };
        return me;
      };
      var _reject = function(error) {
        me.resolved = false;
        me.rejected = true;
        me.pending = false;
        _onFail.forEach(function(fn) {
          fn(error);
        });
        _process = function(onSuccess, onFail) {
          onFail(error);
        };
        _resolve = _reject = function() {
        };
        return me;
      };
      this.cancel = function() {
        if (parent) {
          parent.cancel();
        } else {
          _reject(new CancellationError());
        }
        return me;
      };
      this.timeout = function(delay) {
        if (parent) {
          parent.timeout(delay);
        } else {
          var timer = setTimeout(function() {
            _reject(new TimeoutError("Promise timed out after " + delay + " ms"));
          }, delay);
          me.always(function() {
            clearTimeout(timer);
          });
        }
        return me;
      };
      handler(function(result) {
        _resolve(result);
      }, function(error) {
        _reject(error);
      });
    }
    function _then(callback, resolve2, reject) {
      return function(result) {
        try {
          var res = callback(result);
          if (res && typeof res.then === "function" && typeof res["catch"] === "function") {
            res.then(resolve2, reject);
          } else {
            resolve2(res);
          }
        } catch (error) {
          reject(error);
        }
      };
    }
    Promise2.prototype["catch"] = function(onFail) {
      return this.then(null, onFail);
    };
    Promise2.prototype.always = function(fn) {
      return this.then(fn, fn);
    };
    Promise2.prototype.finally = function(fn) {
      const me = this;
      const final = function() {
        return new Promise2((resolve2) => resolve2()).then(fn).then(() => me);
      };
      return this.then(final, final);
    };
    Promise2.all = function(promises) {
      return new Promise2(function(resolve2, reject) {
        var remaining = promises.length, results = [];
        if (remaining) {
          promises.forEach(function(p, i) {
            p.then(function(result) {
              results[i] = result;
              remaining--;
              if (remaining == 0) {
                resolve2(results);
              }
            }, function(error) {
              remaining = 0;
              reject(error);
            });
          });
        } else {
          resolve2(results);
        }
      });
    };
    Promise2.defer = function() {
      var resolver = {};
      resolver.promise = new Promise2(function(resolve2, reject) {
        resolver.resolve = resolve2;
        resolver.reject = reject;
      });
      return resolver;
    };
    function CancellationError(message) {
      this.message = message || "promise cancelled";
      this.stack = new Error().stack;
    }
    CancellationError.prototype = new Error();
    CancellationError.prototype.constructor = Error;
    CancellationError.prototype.name = "CancellationError";
    Promise2.CancellationError = CancellationError;
    function TimeoutError(message) {
      this.message = message || "timeout exceeded";
      this.stack = new Error().stack;
    }
    TimeoutError.prototype = new Error();
    TimeoutError.prototype.constructor = Error;
    TimeoutError.prototype.name = "TimeoutError";
    Promise2.TimeoutError = TimeoutError;
    exports2.Promise = Promise2;
  }
});

// node_modules/workerpool/src/validateOptions.js
var require_validateOptions = __commonJS({
  "node_modules/workerpool/src/validateOptions.js"(exports2) {
    exports2.validateOptions = function validateOptions(options, allowedOptionNames, objectName) {
      if (!options) {
        return;
      }
      var optionNames = options ? Object.keys(options) : [];
      var unknownOptionName = optionNames.find((optionName) => !allowedOptionNames.includes(optionName));
      if (unknownOptionName) {
        throw new Error('Object "' + objectName + '" contains an unknown option "' + unknownOptionName + '"');
      }
      var illegalOptionName = allowedOptionNames.find((allowedOptionName) => {
        return Object.prototype[allowedOptionName] && !optionNames.includes(allowedOptionName);
      });
      if (illegalOptionName) {
        throw new Error('Object "' + objectName + '" contains an inherited option "' + illegalOptionName + '" which is not defined in the object itself but in its prototype. Only plain objects are allowed. Please remove the option from the prototype or override it with a value "undefined".');
      }
      return options;
    };
    exports2.workerOptsNames = [
      "credentials",
      "name",
      "type"
    ];
    exports2.forkOptsNames = [
      "cwd",
      "detached",
      "env",
      "execPath",
      "execArgv",
      "gid",
      "serialization",
      "signal",
      "killSignal",
      "silent",
      "stdio",
      "uid",
      "windowsVerbatimArguments",
      "timeout"
    ];
    exports2.workerThreadOptsNames = [
      "argv",
      "env",
      "eval",
      "execArgv",
      "stdin",
      "stdout",
      "stderr",
      "workerData",
      "trackUnmanagedFds",
      "transferList",
      "resourceLimits",
      "name"
    ];
  }
});

// node_modules/workerpool/src/generated/embeddedWorker.js
var require_embeddedWorker = __commonJS({
  "node_modules/workerpool/src/generated/embeddedWorker.js"(exports2, module2) {
    module2.exports = `!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(e="undefined"!=typeof globalThis?globalThis:e||self).worker=n()}(this,(function(){"use strict";function e(n){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(n)}function n(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var t={};var r=function(e,n){this.message=e,this.transfer=n},o={};function i(e,n){var t=this;if(!(this instanceof i))throw new SyntaxError("Constructor must be called with the new operator");if("function"!=typeof e)throw new SyntaxError("Function parameter handler(resolve, reject) missing");var r=[],o=[];this.resolved=!1,this.rejected=!1,this.pending=!0,this[Symbol.toStringTag]="Promise";var a=function(e,n){r.push(e),o.push(n)};this.then=function(e,n){return new i((function(t,r){var o=e?s(e,t,r):t,i=n?s(n,t,r):r;a(o,i)}),t)};var f=function(e){return t.resolved=!0,t.rejected=!1,t.pending=!1,r.forEach((function(n){n(e)})),a=function(n,t){n(e)},f=d=function(){},t},d=function(e){return t.resolved=!1,t.rejected=!0,t.pending=!1,o.forEach((function(n){n(e)})),a=function(n,t){t(e)},f=d=function(){},t};this.cancel=function(){return n?n.cancel():d(new u),t},this.timeout=function(e){if(n)n.timeout(e);else{var r=setTimeout((function(){d(new c("Promise timed out after "+e+" ms"))}),e);t.always((function(){clearTimeout(r)}))}return t},e((function(e){f(e)}),(function(e){d(e)}))}function s(e,n,t){return function(r){try{var o=e(r);o&&"function"==typeof o.then&&"function"==typeof o.catch?o.then(n,t):n(o)}catch(e){t(e)}}}function u(e){this.message=e||"promise cancelled",this.stack=(new Error).stack}function c(e){this.message=e||"timeout exceeded",this.stack=(new Error).stack}return i.prototype.catch=function(e){return this.then(null,e)},i.prototype.always=function(e){return this.then(e,e)},i.prototype.finally=function(e){var n=this,t=function(){return new i((function(e){return e()})).then(e).then((function(){return n}))};return this.then(t,t)},i.all=function(e){return new i((function(n,t){var r=e.length,o=[];r?e.forEach((function(e,i){e.then((function(e){o[i]=e,0==--r&&n(o)}),(function(e){r=0,t(e)}))})):n(o)}))},i.defer=function(){var e={};return e.promise=new i((function(n,t){e.resolve=n,e.reject=t})),e},u.prototype=new Error,u.prototype.constructor=Error,u.prototype.name="CancellationError",i.CancellationError=u,c.prototype=new Error,c.prototype.constructor=Error,c.prototype.name="TimeoutError",i.TimeoutError=c,o.Promise=i,function(n){var t=r,i=o.Promise,s="__workerpool-cleanup__",u={exit:function(){}},c={addAbortListener:function(e){u.abortListeners.push(e)},emit:u.emit};if("undefined"!=typeof self&&"function"==typeof postMessage&&"function"==typeof addEventListener)u.on=function(e,n){addEventListener(e,(function(e){n(e.data)}))},u.send=function(e,n){n?postMessage(e,n):postMessage(e)};else{if("undefined"==typeof process)throw new Error("Script must be executed as a worker");var a;try{a=require("worker_threads")}catch(n){if("object"!==e(n)||null===n||"MODULE_NOT_FOUND"!==n.code)throw n}if(a&&null!==a.parentPort){var f=a.parentPort;u.send=f.postMessage.bind(f),u.on=f.on.bind(f),u.exit=process.exit.bind(process)}else u.on=process.on.bind(process),u.send=function(e){process.send(e)},u.on("disconnect",(function(){process.exit(1)})),u.exit=process.exit.bind(process)}function d(e){return e&&e.toJSON?JSON.parse(JSON.stringify(e)):JSON.parse(JSON.stringify(e,Object.getOwnPropertyNames(e)))}function l(e){return e&&"function"==typeof e.then&&"function"==typeof e.catch}u.methods={},u.methods.run=function(e,n){var t=new Function("return ("+e+").apply(this, arguments);");return t.worker=c,t.apply(t,n)},u.methods.methods=function(){return Object.keys(u.methods)},u.terminationHandler=void 0,u.abortListenerTimeout=1e3,u.abortListeners=[],u.terminateAndExit=function(e){var n=function(){u.exit(e)};if(!u.terminationHandler)return n();var t=u.terminationHandler(e);return l(t)?(t.then(n,n),t):(n(),new i((function(e,n){n(new Error("Worker terminating"))})))},u.cleanup=function(e){if(!u.abortListeners.length)return u.send({id:e,method:s,error:d(new Error("Worker terminating"))}),new i((function(e){e()}));var n,t=u.abortListeners.map((function(e){return e()})),r=new i((function(e,t){n=setTimeout((function(){t(new Error("Timeout occured waiting for abort handler, killing worker"))}),u.abortListenerTimeout)})),o=i.all(t).then((function(){clearTimeout(n),u.abortListeners.length||(u.abortListeners=[])}),(function(){clearTimeout(n),u.exit()}));return new i((function(e,n){o.then(e,n),r.then(e,n)})).then((function(){u.send({id:e,method:s,error:null})}),(function(n){u.send({id:e,method:s,error:n?d(n):null})}))};var p=null;u.on("message",(function(e){if("__workerpool-terminate__"===e)return u.terminateAndExit(0);if(e.method===s)return u.cleanup(e.id);try{var n=u.methods[e.method];if(!n)throw new Error('Unknown method "'+e.method+'"');p=e.id;var r=n.apply(n,e.params);l(r)?r.then((function(n){n instanceof t?u.send({id:e.id,result:n.message,error:null},n.transfer):u.send({id:e.id,result:n,error:null}),p=null})).catch((function(n){u.send({id:e.id,result:null,error:d(n)}),p=null})):(r instanceof t?u.send({id:e.id,result:r.message,error:null},r.transfer):u.send({id:e.id,result:r,error:null}),p=null)}catch(n){u.send({id:e.id,result:null,error:d(n)})}})),u.register=function(e,n){if(e)for(var t in e)e.hasOwnProperty(t)&&(u.methods[t]=e[t],u.methods[t].worker=c);n&&(u.terminationHandler=n.onTerminate,u.abortListenerTimeout=n.abortListenerTimeout||1e3),u.send("ready")},u.emit=function(e){if(p){if(e instanceof t)return void u.send({id:p,isEvent:!0,payload:e.message},e.transfer);u.send({id:p,isEvent:!0,payload:e})}},n.add=u.register,n.emit=u.emit}(t),n(t)}));
//# sourceMappingURL=worker.min.js.map
`;
  }
});

// node_modules/workerpool/src/WorkerHandler.js
var require_WorkerHandler = __commonJS({
  "node_modules/workerpool/src/WorkerHandler.js"(exports2, module2) {
    "use strict";
    var { Promise: Promise2 } = require_Promise();
    var environment = require_environment();
    var { validateOptions, forkOptsNames, workerThreadOptsNames, workerOptsNames } = require_validateOptions();
    var TERMINATE_METHOD_ID = "__workerpool-terminate__";
    var CLEANUP_METHOD_ID = "__workerpool-cleanup__";
    function ensureWorkerThreads() {
      var WorkerThreads = tryRequireWorkerThreads();
      if (!WorkerThreads) {
        throw new Error("WorkerPool: workerType = 'thread' is not supported, Node >= 11.7.0 required");
      }
      return WorkerThreads;
    }
    function ensureWebWorker() {
      if (typeof Worker !== "function" && (typeof Worker !== "object" || typeof Worker.prototype.constructor !== "function")) {
        throw new Error("WorkerPool: Web Workers not supported");
      }
    }
    function tryRequireWorkerThreads() {
      try {
        return require("worker_threads");
      } catch (error) {
        if (typeof error === "object" && error !== null && error.code === "MODULE_NOT_FOUND") {
          return null;
        } else {
          throw error;
        }
      }
    }
    function getDefaultWorker() {
      if (environment.platform === "browser") {
        if (typeof Blob === "undefined") {
          throw new Error("Blob not supported by the browser");
        }
        if (!window.URL || typeof window.URL.createObjectURL !== "function") {
          throw new Error("URL.createObjectURL not supported by the browser");
        }
        var blob = new Blob([require_embeddedWorker()], { type: "text/javascript" });
        return window.URL.createObjectURL(blob);
      } else {
        return __dirname + "/worker.js";
      }
    }
    function setupWorker(script, options) {
      if (options.workerType === "web") {
        ensureWebWorker();
        return setupBrowserWorker(script, options.workerOpts, Worker);
      } else if (options.workerType === "thread") {
        WorkerThreads = ensureWorkerThreads();
        return setupWorkerThreadWorker(script, WorkerThreads, options);
      } else if (options.workerType === "process" || !options.workerType) {
        return setupProcessWorker(script, resolveForkOptions(options), require("child_process"));
      } else {
        if (environment.platform === "browser") {
          ensureWebWorker();
          return setupBrowserWorker(script, options.workerOpts, Worker);
        } else {
          var WorkerThreads = tryRequireWorkerThreads();
          if (WorkerThreads) {
            return setupWorkerThreadWorker(script, WorkerThreads, options);
          } else {
            return setupProcessWorker(script, resolveForkOptions(options), require("child_process"));
          }
        }
      }
    }
    function setupBrowserWorker(script, workerOpts, Worker2) {
      validateOptions(workerOpts, workerOptsNames, "workerOpts");
      var worker = new Worker2(script, workerOpts);
      worker.isBrowserWorker = true;
      worker.on = function(event, callback) {
        this.addEventListener(event, function(message) {
          callback(message.data);
        });
      };
      worker.send = function(message, transfer) {
        this.postMessage(message, transfer);
      };
      return worker;
    }
    function setupWorkerThreadWorker(script, WorkerThreads, options) {
      validateOptions(options?.workerThreadOpts, workerThreadOptsNames, "workerThreadOpts");
      var worker = new WorkerThreads.Worker(script, {
        stdout: options?.emitStdStreams ?? false,
        // pipe worker.STDOUT to process.STDOUT if not requested
        stderr: options?.emitStdStreams ?? false,
        // pipe worker.STDERR to process.STDERR if not requested
        ...options?.workerThreadOpts
      });
      worker.isWorkerThread = true;
      worker.send = function(message, transfer) {
        this.postMessage(message, transfer);
      };
      worker.kill = function() {
        this.terminate();
        return true;
      };
      worker.disconnect = function() {
        this.terminate();
      };
      if (options?.emitStdStreams) {
        worker.stdout.on("data", (data) => worker.emit("stdout", data));
        worker.stderr.on("data", (data) => worker.emit("stderr", data));
      }
      return worker;
    }
    function setupProcessWorker(script, options, child_process) {
      validateOptions(options.forkOpts, forkOptsNames, "forkOpts");
      var worker = child_process.fork(
        script,
        options.forkArgs,
        options.forkOpts
      );
      var send = worker.send;
      worker.send = function(message) {
        return send.call(worker, message);
      };
      if (options.emitStdStreams) {
        worker.stdout.on("data", (data) => worker.emit("stdout", data));
        worker.stderr.on("data", (data) => worker.emit("stderr", data));
      }
      worker.isChildProcess = true;
      return worker;
    }
    function resolveForkOptions(opts) {
      opts = opts || {};
      var processExecArgv = process.execArgv.join(" ");
      var inspectorActive = processExecArgv.indexOf("--inspect") !== -1;
      var debugBrk = processExecArgv.indexOf("--debug-brk") !== -1;
      var execArgv = [];
      if (inspectorActive) {
        execArgv.push("--inspect=" + opts.debugPort);
        if (debugBrk) {
          execArgv.push("--debug-brk");
        }
      }
      process.execArgv.forEach(function(arg) {
        if (arg.indexOf("--max-old-space-size") > -1) {
          execArgv.push(arg);
        }
      });
      return Object.assign({}, opts, {
        forkArgs: opts.forkArgs,
        forkOpts: Object.assign({}, opts.forkOpts, {
          execArgv: (opts.forkOpts && opts.forkOpts.execArgv || []).concat(execArgv),
          stdio: opts.emitStdStreams ? "pipe" : void 0
        })
      });
    }
    function objectToError(obj) {
      var temp = new Error("");
      var props = Object.keys(obj);
      for (var i = 0; i < props.length; i++) {
        temp[props[i]] = obj[props[i]];
      }
      return temp;
    }
    function handleEmittedStdPayload(handler, payload) {
      Object.values(handler.processing).forEach((task) => task?.options?.on(payload));
      Object.values(handler.tracking).forEach((task) => task?.options?.on(payload));
    }
    function WorkerHandler(script, _options) {
      var me = this;
      var options = _options || {};
      this.script = script || getDefaultWorker();
      this.worker = setupWorker(this.script, options);
      this.debugPort = options.debugPort;
      this.forkOpts = options.forkOpts;
      this.forkArgs = options.forkArgs;
      this.workerOpts = options.workerOpts;
      this.workerThreadOpts = options.workerThreadOpts;
      this.workerTerminateTimeout = options.workerTerminateTimeout;
      if (!script) {
        this.worker.ready = true;
      }
      this.requestQueue = [];
      this.worker.on("stdout", function(data) {
        handleEmittedStdPayload(me, { "stdout": data.toString() });
      });
      this.worker.on("stderr", function(data) {
        handleEmittedStdPayload(me, { "stderr": data.toString() });
      });
      this.worker.on("message", function(response) {
        if (me.terminated) {
          return;
        }
        if (typeof response === "string" && response === "ready") {
          me.worker.ready = true;
          dispatchQueuedRequests();
        } else {
          var id = response.id;
          var task = me.processing[id];
          if (task !== void 0) {
            if (response.isEvent) {
              if (task.options && typeof task.options.on === "function") {
                task.options.on(response.payload);
              }
            } else {
              delete me.processing[id];
              if (me.terminating === true) {
                me.terminate();
              }
              if (response.error) {
                task.resolver.reject(objectToError(response.error));
              } else {
                task.resolver.resolve(response.result);
              }
            }
          } else {
            var task = me.tracking[id];
            if (task !== void 0) {
              if (response.isEvent) {
                if (task.options && typeof task.options.on === "function") {
                  task.options.on(response.payload);
                }
              }
            }
          }
          if (response.method === CLEANUP_METHOD_ID) {
            var trackedTask = me.tracking[response.id];
            if (trackedTask !== void 0) {
              if (response.error) {
                clearTimeout(trackedTask.timeoutId);
                trackedTask.resolver.reject(objectToError(response.error));
              } else {
                me.tracking && clearTimeout(trackedTask.timeoutId);
                trackedTask.resolver.reject(new WrappedTimeoutError(trackedTask.error));
              }
            }
            delete me.tracking[id];
          }
        }
      });
      function onError(error) {
        me.terminated = true;
        for (var id in me.processing) {
          if (me.processing[id] !== void 0) {
            me.processing[id].resolver.reject(error);
          }
        }
        me.processing = /* @__PURE__ */ Object.create(null);
      }
      function dispatchQueuedRequests() {
        for (const request of me.requestQueue.splice(0)) {
          me.worker.send(request.message, request.transfer);
        }
      }
      var worker = this.worker;
      this.worker.on("error", onError);
      this.worker.on("exit", function(exitCode, signalCode) {
        var message = "Workerpool Worker terminated Unexpectedly\n";
        message += "    exitCode: `" + exitCode + "`\n";
        message += "    signalCode: `" + signalCode + "`\n";
        message += "    workerpool.script: `" + me.script + "`\n";
        message += "    spawnArgs: `" + worker.spawnargs + "`\n";
        message += "    spawnfile: `" + worker.spawnfile + "`\n";
        message += "    stdout: `" + worker.stdout + "`\n";
        message += "    stderr: `" + worker.stderr + "`\n";
        onError(new Error(message));
      });
      this.processing = /* @__PURE__ */ Object.create(null);
      this.tracking = /* @__PURE__ */ Object.create(null);
      this.terminating = false;
      this.terminated = false;
      this.cleaning = false;
      this.terminationHandler = null;
      this.lastId = 0;
    }
    WorkerHandler.prototype.methods = function() {
      return this.exec("methods");
    };
    WorkerHandler.prototype.exec = function(method, params, resolver, options) {
      if (!resolver) {
        resolver = Promise2.defer();
      }
      var id = ++this.lastId;
      this.processing[id] = {
        id,
        resolver,
        options
      };
      var request = {
        message: {
          id,
          method,
          params
        },
        transfer: options && options.transfer
      };
      if (this.terminated) {
        resolver.reject(new Error("Worker is terminated"));
      } else if (this.worker.ready) {
        this.worker.send(request.message, request.transfer);
      } else {
        this.requestQueue.push(request);
      }
      var me = this;
      return resolver.promise.catch(function(error) {
        if (error instanceof Promise2.CancellationError || error instanceof Promise2.TimeoutError) {
          me.tracking[id] = {
            id,
            resolver: Promise2.defer(),
            options,
            error
          };
          delete me.processing[id];
          me.tracking[id].resolver.promise = me.tracking[id].resolver.promise.catch(function(err) {
            delete me.tracking[id];
            if (err instanceof WrappedTimeoutError) {
              throw err.error;
            }
            var promise = me.terminateAndNotify(true).then(function() {
              throw err;
            }, function(err2) {
              throw err2;
            });
            return promise;
          });
          me.worker.send({
            id,
            method: CLEANUP_METHOD_ID
          });
          me.tracking[id].timeoutId = setTimeout(function() {
            me.tracking[id].resolver.reject(error);
          }, me.workerTerminateTimeout);
          return me.tracking[id].resolver.promise;
        } else {
          throw error;
        }
      });
    };
    WorkerHandler.prototype.busy = function() {
      return this.cleaning || Object.keys(this.processing).length > 0;
    };
    WorkerHandler.prototype.terminate = function(force, callback) {
      var me = this;
      if (force) {
        for (var id in this.processing) {
          if (this.processing[id] !== void 0) {
            this.processing[id].resolver.reject(new Error("Worker terminated"));
          }
        }
        this.processing = /* @__PURE__ */ Object.create(null);
      }
      for (var task of Object.values(me.tracking)) {
        clearTimeout(task.timeoutId);
        task.resolver.reject(new Error("Worker Terminating"));
      }
      me.tracking = /* @__PURE__ */ Object.create(null);
      if (typeof callback === "function") {
        this.terminationHandler = callback;
      }
      if (!this.busy()) {
        var cleanup = function(err) {
          me.terminated = true;
          me.cleaning = false;
          if (me.worker != null && me.worker.removeAllListeners) {
            me.worker.removeAllListeners("message");
          }
          me.worker = null;
          me.terminating = false;
          if (me.terminationHandler) {
            me.terminationHandler(err, me);
          } else if (err) {
            throw err;
          }
        };
        if (this.worker) {
          if (typeof this.worker.kill === "function") {
            if (this.worker.killed) {
              cleanup(new Error("worker already killed!"));
              return;
            }
            var cleanExitTimeout = setTimeout(function() {
              if (me.worker) {
                me.worker.kill();
              }
            }, this.workerTerminateTimeout);
            this.worker.once("exit", function() {
              clearTimeout(cleanExitTimeout);
              if (me.worker) {
                me.worker.killed = true;
              }
              cleanup();
            });
            if (this.worker.ready) {
              this.worker.send(TERMINATE_METHOD_ID);
            } else {
              this.requestQueue.push({ message: TERMINATE_METHOD_ID });
            }
            this.cleaning = true;
            return;
          } else if (typeof this.worker.terminate === "function") {
            this.worker.terminate();
            this.worker.killed = true;
          } else {
            throw new Error("Failed to terminate worker");
          }
        }
        cleanup();
      } else {
        this.terminating = true;
      }
    };
    WorkerHandler.prototype.terminateAndNotify = function(force, timeout) {
      var resolver = Promise2.defer();
      if (timeout) {
        resolver.promise.timeout(timeout);
      }
      this.terminate(force, function(err, worker) {
        if (err) {
          resolver.reject(err);
        } else {
          resolver.resolve(worker);
        }
      });
      return resolver.promise;
    };
    function WrappedTimeoutError(timeoutError) {
      this.error = timeoutError;
      this.stack = new Error().stack;
    }
    module2.exports = WorkerHandler;
    module2.exports._tryRequireWorkerThreads = tryRequireWorkerThreads;
    module2.exports._setupProcessWorker = setupProcessWorker;
    module2.exports._setupBrowserWorker = setupBrowserWorker;
    module2.exports._setupWorkerThreadWorker = setupWorkerThreadWorker;
    module2.exports.ensureWorkerThreads = ensureWorkerThreads;
  }
});

// node_modules/workerpool/src/debug-port-allocator.js
var require_debug_port_allocator = __commonJS({
  "node_modules/workerpool/src/debug-port-allocator.js"(exports2, module2) {
    "use strict";
    var MAX_PORTS = 65535;
    module2.exports = DebugPortAllocator;
    function DebugPortAllocator() {
      this.ports = /* @__PURE__ */ Object.create(null);
      this.length = 0;
    }
    DebugPortAllocator.prototype.nextAvailableStartingAt = function(starting) {
      while (this.ports[starting] === true) {
        starting++;
      }
      if (starting >= MAX_PORTS) {
        throw new Error("WorkerPool debug port limit reached: " + starting + ">= " + MAX_PORTS);
      }
      this.ports[starting] = true;
      this.length++;
      return starting;
    };
    DebugPortAllocator.prototype.releasePort = function(port) {
      delete this.ports[port];
      this.length--;
    };
  }
});

// node_modules/workerpool/src/Pool.js
var require_Pool = __commonJS({
  "node_modules/workerpool/src/Pool.js"(exports2, module2) {
    var { Promise: Promise2 } = require_Promise();
    var WorkerHandler = require_WorkerHandler();
    var environment = require_environment();
    var DebugPortAllocator = require_debug_port_allocator();
    var DEBUG_PORT_ALLOCATOR = new DebugPortAllocator();
    function Pool(script, options) {
      if (typeof script === "string") {
        this.script = script || null;
      } else {
        this.script = null;
        options = script;
      }
      this.workers = [];
      this.tasks = [];
      options = options || {};
      this.forkArgs = Object.freeze(options.forkArgs || []);
      this.forkOpts = Object.freeze(options.forkOpts || {});
      this.workerOpts = Object.freeze(options.workerOpts || {});
      this.workerThreadOpts = Object.freeze(options.workerThreadOpts || {});
      this.debugPortStart = options.debugPortStart || 43210;
      this.nodeWorker = options.nodeWorker;
      this.workerType = options.workerType || options.nodeWorker || "auto";
      this.maxQueueSize = options.maxQueueSize || Infinity;
      this.workerTerminateTimeout = options.workerTerminateTimeout || 1e3;
      this.onCreateWorker = options.onCreateWorker || (() => null);
      this.onTerminateWorker = options.onTerminateWorker || (() => null);
      this.emitStdStreams = options.emitStdStreams || false;
      if (options && "maxWorkers" in options) {
        validateMaxWorkers(options.maxWorkers);
        this.maxWorkers = options.maxWorkers;
      } else {
        this.maxWorkers = Math.max((environment.cpus || 4) - 1, 1);
      }
      if (options && "minWorkers" in options) {
        if (options.minWorkers === "max") {
          this.minWorkers = this.maxWorkers;
        } else {
          validateMinWorkers(options.minWorkers);
          this.minWorkers = options.minWorkers;
          this.maxWorkers = Math.max(this.minWorkers, this.maxWorkers);
        }
        this._ensureMinWorkers();
      }
      this._boundNext = this._next.bind(this);
      if (this.workerType === "thread") {
        WorkerHandler.ensureWorkerThreads();
      }
    }
    Pool.prototype.exec = function(method, params, options) {
      if (params && !Array.isArray(params)) {
        throw new TypeError('Array expected as argument "params"');
      }
      if (typeof method === "string") {
        var resolver = Promise2.defer();
        if (this.tasks.length >= this.maxQueueSize) {
          throw new Error("Max queue size of " + this.maxQueueSize + " reached");
        }
        var tasks = this.tasks;
        var task = {
          method,
          params,
          resolver,
          timeout: null,
          options
        };
        tasks.push(task);
        var originalTimeout = resolver.promise.timeout;
        resolver.promise.timeout = function timeout(delay) {
          if (tasks.indexOf(task) !== -1) {
            task.timeout = delay;
            return resolver.promise;
          } else {
            return originalTimeout.call(resolver.promise, delay);
          }
        };
        this._next();
        return resolver.promise;
      } else if (typeof method === "function") {
        return this.exec("run", [String(method), params], options);
      } else {
        throw new TypeError('Function or string expected as argument "method"');
      }
    };
    Pool.prototype.proxy = function() {
      if (arguments.length > 0) {
        throw new Error("No arguments expected");
      }
      var pool = this;
      return this.exec("methods").then(function(methods) {
        var proxy = {};
        methods.forEach(function(method) {
          proxy[method] = function() {
            return pool.exec(method, Array.prototype.slice.call(arguments));
          };
        });
        return proxy;
      });
    };
    Pool.prototype._next = function() {
      if (this.tasks.length > 0) {
        var worker = this._getWorker();
        if (worker) {
          var me = this;
          var task = this.tasks.shift();
          if (task.resolver.promise.pending) {
            var promise = worker.exec(task.method, task.params, task.resolver, task.options).then(me._boundNext).catch(function() {
              if (worker.terminated) {
                return me._removeWorker(worker);
              }
            }).then(function() {
              me._next();
            });
            if (typeof task.timeout === "number") {
              promise.timeout(task.timeout);
            }
          } else {
            me._next();
          }
        }
      }
    };
    Pool.prototype._getWorker = function() {
      var workers = this.workers;
      for (var i = 0; i < workers.length; i++) {
        var worker = workers[i];
        if (worker.busy() === false) {
          return worker;
        }
      }
      if (workers.length < this.maxWorkers) {
        worker = this._createWorkerHandler();
        workers.push(worker);
        return worker;
      }
      return null;
    };
    Pool.prototype._removeWorker = function(worker) {
      var me = this;
      DEBUG_PORT_ALLOCATOR.releasePort(worker.debugPort);
      this._removeWorkerFromList(worker);
      this._ensureMinWorkers();
      return new Promise2(function(resolve2, reject) {
        worker.terminate(false, function(err) {
          me.onTerminateWorker({
            forkArgs: worker.forkArgs,
            forkOpts: worker.forkOpts,
            workerThreadOpts: worker.workerThreadOpts,
            script: worker.script
          });
          if (err) {
            reject(err);
          } else {
            resolve2(worker);
          }
        });
      });
    };
    Pool.prototype._removeWorkerFromList = function(worker) {
      var index = this.workers.indexOf(worker);
      if (index !== -1) {
        this.workers.splice(index, 1);
      }
    };
    Pool.prototype.terminate = function(force, timeout) {
      var me = this;
      this.tasks.forEach(function(task) {
        task.resolver.reject(new Error("Pool terminated"));
      });
      this.tasks.length = 0;
      var f = function(worker) {
        DEBUG_PORT_ALLOCATOR.releasePort(worker.debugPort);
        this._removeWorkerFromList(worker);
      };
      var removeWorker = f.bind(this);
      var promises = [];
      var workers = this.workers.slice();
      workers.forEach(function(worker) {
        var termPromise = worker.terminateAndNotify(force, timeout).then(removeWorker).always(function() {
          me.onTerminateWorker({
            forkArgs: worker.forkArgs,
            forkOpts: worker.forkOpts,
            workerThreadOpts: worker.workerThreadOpts,
            script: worker.script
          });
        });
        promises.push(termPromise);
      });
      return Promise2.all(promises);
    };
    Pool.prototype.stats = function() {
      var totalWorkers = this.workers.length;
      var busyWorkers = this.workers.filter(function(worker) {
        return worker.busy();
      }).length;
      return {
        totalWorkers,
        busyWorkers,
        idleWorkers: totalWorkers - busyWorkers,
        pendingTasks: this.tasks.length,
        activeTasks: busyWorkers
      };
    };
    Pool.prototype._ensureMinWorkers = function() {
      if (this.minWorkers) {
        for (var i = this.workers.length; i < this.minWorkers; i++) {
          this.workers.push(this._createWorkerHandler());
        }
      }
    };
    Pool.prototype._createWorkerHandler = function() {
      const overriddenParams = this.onCreateWorker({
        forkArgs: this.forkArgs,
        forkOpts: this.forkOpts,
        workerOpts: this.workerOpts,
        workerThreadOpts: this.workerThreadOpts,
        script: this.script
      }) || {};
      return new WorkerHandler(overriddenParams.script || this.script, {
        forkArgs: overriddenParams.forkArgs || this.forkArgs,
        forkOpts: overriddenParams.forkOpts || this.forkOpts,
        workerOpts: overriddenParams.workerOpts || this.workerOpts,
        workerThreadOpts: overriddenParams.workerThreadOpts || this.workerThreadOpts,
        debugPort: DEBUG_PORT_ALLOCATOR.nextAvailableStartingAt(this.debugPortStart),
        workerType: this.workerType,
        workerTerminateTimeout: this.workerTerminateTimeout,
        emitStdStreams: this.emitStdStreams
      });
    };
    function validateMaxWorkers(maxWorkers) {
      if (!isNumber(maxWorkers) || !isInteger(maxWorkers) || maxWorkers < 1) {
        throw new TypeError("Option maxWorkers must be an integer number >= 1");
      }
    }
    function validateMinWorkers(minWorkers) {
      if (!isNumber(minWorkers) || !isInteger(minWorkers) || minWorkers < 0) {
        throw new TypeError("Option minWorkers must be an integer number >= 0");
      }
    }
    function isNumber(value) {
      return typeof value === "number";
    }
    function isInteger(value) {
      return Math.round(value) == value;
    }
    module2.exports = Pool;
  }
});

// node_modules/workerpool/src/transfer.js
var require_transfer = __commonJS({
  "node_modules/workerpool/src/transfer.js"(exports2, module2) {
    function Transfer(message, transfer) {
      this.message = message;
      this.transfer = transfer;
    }
    module2.exports = Transfer;
  }
});

// node_modules/workerpool/src/worker.js
var require_worker = __commonJS({
  "node_modules/workerpool/src/worker.js"(exports2) {
    var Transfer = require_transfer();
    var Promise2 = require_Promise().Promise;
    var TERMINATE_METHOD_ID = "__workerpool-terminate__";
    var CLEANUP_METHOD_ID = "__workerpool-cleanup__";
    var TIMEOUT_DEFAULT = 1e3;
    var worker = {
      exit: function() {
      }
    };
    var publicWorker = {
      /**
       * Registers listeners which will trigger when a task is timed out or cancled. If all listeners resolve, the worker executing the given task will not be terminated.
       * *Note*: If there is a blocking operation within a listener, the worker will be terminated.
       * @param {() => Promise<void>} listener
      */
      addAbortListener: function(listener) {
        worker.abortListeners.push(listener);
      },
      /**
        * Emit an event from the worker thread to the main thread.
        * @param {any} payload
      */
      emit: worker.emit
    };
    if (typeof self !== "undefined" && typeof postMessage === "function" && typeof addEventListener === "function") {
      worker.on = function(event, callback) {
        addEventListener(event, function(message) {
          callback(message.data);
        });
      };
      worker.send = function(message, transfer) {
        transfer ? postMessage(message, transfer) : postMessage(message);
      };
    } else if (typeof process !== "undefined") {
      try {
        WorkerThreads = require("worker_threads");
      } catch (error) {
        if (typeof error === "object" && error !== null && error.code === "MODULE_NOT_FOUND") {
        } else {
          throw error;
        }
      }
      if (WorkerThreads && /* if there is a parentPort, we are in a WorkerThread */
      WorkerThreads.parentPort !== null) {
        parentPort = WorkerThreads.parentPort;
        worker.send = parentPort.postMessage.bind(parentPort);
        worker.on = parentPort.on.bind(parentPort);
        worker.exit = process.exit.bind(process);
      } else {
        worker.on = process.on.bind(process);
        worker.send = function(message) {
          process.send(message);
        };
        worker.on("disconnect", function() {
          process.exit(1);
        });
        worker.exit = process.exit.bind(process);
      }
    } else {
      throw new Error("Script must be executed as a worker");
    }
    var WorkerThreads;
    var parentPort;
    function convertError(error) {
      if (error && error.toJSON) {
        return JSON.parse(JSON.stringify(error));
      }
      return JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
    function isPromise(value) {
      return value && typeof value.then === "function" && typeof value.catch === "function";
    }
    worker.methods = {};
    worker.methods.run = function run2(fn, args) {
      var f = new Function("return (" + fn + ").apply(this, arguments);");
      f.worker = publicWorker;
      return f.apply(f, args);
    };
    worker.methods.methods = function methods() {
      return Object.keys(worker.methods);
    };
    worker.terminationHandler = void 0;
    worker.abortListenerTimeout = TIMEOUT_DEFAULT;
    worker.abortListeners = [];
    worker.terminateAndExit = function(code) {
      var _exit = function() {
        worker.exit(code);
      };
      if (!worker.terminationHandler) {
        return _exit();
      }
      var result = worker.terminationHandler(code);
      if (isPromise(result)) {
        result.then(_exit, _exit);
        return result;
      } else {
        _exit();
        return new Promise2(function(_resolve, reject) {
          reject(new Error("Worker terminating"));
        });
      }
    };
    worker.cleanup = function(requestId) {
      if (!worker.abortListeners.length) {
        worker.send({
          id: requestId,
          method: CLEANUP_METHOD_ID,
          error: convertError(new Error("Worker terminating"))
        });
        return new Promise2(function(resolve2) {
          resolve2();
        });
      }
      var _exit = function() {
        worker.exit();
      };
      var _abort = function() {
        if (!worker.abortListeners.length) {
          worker.abortListeners = [];
        }
      };
      const promises = worker.abortListeners.map((listener) => listener());
      let timerId;
      const timeoutPromise = new Promise2((_resolve, reject) => {
        timerId = setTimeout(function() {
          reject(new Error("Timeout occured waiting for abort handler, killing worker"));
        }, worker.abortListenerTimeout);
      });
      const settlePromise = Promise2.all(promises).then(function() {
        clearTimeout(timerId);
        _abort();
      }, function() {
        clearTimeout(timerId);
        _exit();
      });
      return new Promise2(function(resolve2, reject) {
        settlePromise.then(resolve2, reject);
        timeoutPromise.then(resolve2, reject);
      }).then(function() {
        worker.send({
          id: requestId,
          method: CLEANUP_METHOD_ID,
          error: null
        });
      }, function(err) {
        worker.send({
          id: requestId,
          method: CLEANUP_METHOD_ID,
          error: err ? convertError(err) : null
        });
      });
    };
    var currentRequestId = null;
    worker.on("message", function(request) {
      if (request === TERMINATE_METHOD_ID) {
        return worker.terminateAndExit(0);
      }
      if (request.method === CLEANUP_METHOD_ID) {
        return worker.cleanup(request.id);
      }
      try {
        var method = worker.methods[request.method];
        if (method) {
          currentRequestId = request.id;
          var result = method.apply(method, request.params);
          if (isPromise(result)) {
            result.then(function(result2) {
              if (result2 instanceof Transfer) {
                worker.send({
                  id: request.id,
                  result: result2.message,
                  error: null
                }, result2.transfer);
              } else {
                worker.send({
                  id: request.id,
                  result: result2,
                  error: null
                });
              }
              currentRequestId = null;
            }).catch(function(err) {
              worker.send({
                id: request.id,
                result: null,
                error: convertError(err)
              });
              currentRequestId = null;
            });
          } else {
            if (result instanceof Transfer) {
              worker.send({
                id: request.id,
                result: result.message,
                error: null
              }, result.transfer);
            } else {
              worker.send({
                id: request.id,
                result,
                error: null
              });
            }
            currentRequestId = null;
          }
        } else {
          throw new Error('Unknown method "' + request.method + '"');
        }
      } catch (err) {
        worker.send({
          id: request.id,
          result: null,
          error: convertError(err)
        });
      }
    });
    worker.register = function(methods, options) {
      if (methods) {
        for (var name in methods) {
          if (methods.hasOwnProperty(name)) {
            worker.methods[name] = methods[name];
            worker.methods[name].worker = publicWorker;
          }
        }
      }
      if (options) {
        worker.terminationHandler = options.onTerminate;
        worker.abortListenerTimeout = options.abortListenerTimeout || TIMEOUT_DEFAULT;
      }
      worker.send("ready");
    };
    worker.emit = function(payload) {
      if (currentRequestId) {
        if (payload instanceof Transfer) {
          worker.send({
            id: currentRequestId,
            isEvent: true,
            payload: payload.message
          }, payload.transfer);
          return;
        }
        worker.send({
          id: currentRequestId,
          isEvent: true,
          payload
        });
      }
    };
    if (typeof exports2 !== "undefined") {
      exports2.add = worker.register;
      exports2.emit = worker.emit;
    }
  }
});

// node_modules/workerpool/src/index.js
var require_src2 = __commonJS({
  "node_modules/workerpool/src/index.js"(exports2) {
    var { platform, isMainThread, cpus } = require_environment();
    function pool(script, options) {
      var Pool = require_Pool();
      return new Pool(script, options);
    }
    exports2.pool = pool;
    function worker(methods, options) {
      var worker2 = require_worker();
      worker2.add(methods, options);
    }
    exports2.worker = worker;
    function workerEmit(payload) {
      var worker2 = require_worker();
      worker2.emit(payload);
    }
    exports2.workerEmit = workerEmit;
    var { Promise: Promise2 } = require_Promise();
    exports2.Promise = Promise2;
    exports2.Transfer = require_transfer();
    exports2.platform = platform;
    exports2.isMainThread = isMainThread;
    exports2.cpus = cpus;
  }
});

// node_modules/mocha/lib/nodejs/serializer.js
var require_serializer = __commonJS({
  "node_modules/mocha/lib/nodejs/serializer.js"(exports2) {
    "use strict";
    var { type, breakCircularDeps } = require_utils();
    var { createInvalidArgumentTypeError } = require_errors();
    var debug = require_src()("mocha:serializer");
    var SERIALIZABLE_RESULT_NAME = "SerializableWorkerResult";
    var SERIALIZABLE_TYPES = /* @__PURE__ */ new Set(["object", "array", "function", "error"]);
    var SerializableWorkerResult = class _SerializableWorkerResult {
      /**
       * Creates instance props; of note, the `__type` prop.
       *
       * Note that the failure count is _redundant_ and could be derived from the
       * list of events; but since we're already doing the work, might as well use
       * it.
       * @param {SerializableEvent[]} [events=[]] - Events to eventually serialize
       * @param {number} [failureCount=0] - Failure count
       */
      constructor(events = [], failureCount = 0) {
        this.failureCount = failureCount;
        this.events = events;
        Object.defineProperty(this, "__type", {
          value: SERIALIZABLE_RESULT_NAME,
          enumerable: true,
          writable: false
        });
      }
      /**
       * Instantiates a new {@link SerializableWorkerResult}.
       * @param {...any} args - Args to constructor
       * @returns {SerializableWorkerResult}
       */
      static create(...args) {
        return new _SerializableWorkerResult(...args);
      }
      /**
       * Serializes each {@link SerializableEvent} in our `events` prop;
       * makes this object read-only.
       * @returns {Readonly<SerializableWorkerResult>}
       */
      serialize() {
        this.events.forEach((event) => {
          event.serialize();
        });
        return Object.freeze(this);
      }
      /**
       * Deserializes a {@link SerializedWorkerResult} into something reporters can
       * use; calls {@link SerializableEvent.deserialize} on each item in its
       * `events` prop.
       * @param {SerializedWorkerResult} obj
       * @returns {SerializedWorkerResult}
       */
      static deserialize(obj) {
        obj.events.forEach((event) => {
          SerializableEvent.deserialize(event);
        });
        return obj;
      }
      /**
       * Returns `true` if this is a {@link SerializedWorkerResult} or a
       * {@link SerializableWorkerResult}.
       * @param {*} value - A value to check
       * @returns {boolean} If true, it's deserializable
       */
      static isSerializedWorkerResult(value) {
        return value instanceof _SerializableWorkerResult || type(value) === "object" && value.__type === SERIALIZABLE_RESULT_NAME;
      }
    };
    var SerializableEvent = class _SerializableEvent {
      /**
       * Constructs a `SerializableEvent`, throwing if we receive unexpected data.
       *
       * Practically, events emitted from `Runner` have a minimum of zero (0)
       * arguments-- (for example, {@link Runnable.constants.EVENT_RUN_BEGIN}) and a
       * maximum of two (2) (for example,
       * {@link Runnable.constants.EVENT_TEST_FAIL}, where the second argument is an
       * `Error`).  The first argument, if present, is a {@link Runnable}. This
       * constructor's arguments adhere to this convention.
       * @param {string} eventName - A non-empty event name.
       * @param {any} [originalValue] - Some data. Corresponds to extra arguments
       * passed to `EventEmitter#emit`.
       * @param {Error} [originalError] - An error, if there's an error.
       * @throws If `eventName` is empty, or `originalValue` is a non-object.
       */
      constructor(eventName, originalValue, originalError) {
        if (!eventName) {
          throw createInvalidArgumentTypeError(
            "Empty `eventName` string argument",
            "eventName",
            "string"
          );
        }
        this.eventName = eventName;
        const originalValueType = type(originalValue);
        if (originalValueType !== "object" && originalValueType !== "undefined") {
          throw createInvalidArgumentTypeError(
            `Expected object but received ${originalValueType}`,
            "originalValue",
            "object"
          );
        }
        Object.defineProperty(this, "originalError", {
          value: originalError,
          enumerable: false
        });
        Object.defineProperty(this, "originalValue", {
          value: originalValue,
          enumerable: false
        });
      }
      /**
       * In case you hated using `new` (I do).
       *
       * @param  {...any} args - Args for {@link SerializableEvent#constructor}.
       * @returns {SerializableEvent} A new `SerializableEvent`
       */
      static create(...args) {
        return new _SerializableEvent(...args);
      }
      /**
       * Used internally by {@link SerializableEvent#serialize}.
       * @ignore
       * @param {Array<object|string>} pairs - List of parent/key tuples to process; modified in-place. This JSDoc type is an approximation
       * @param {object} parent - Some parent object
       * @param {string} key - Key to inspect
       */
      static _serialize(pairs, parent, key) {
        let value = parent[key];
        let _type = type(value);
        if (_type === "error") {
          value = Object.assign(/* @__PURE__ */ Object.create(null), value, {
            stack: value.stack,
            message: value.message,
            __type: "Error"
          });
          parent[key] = value;
          _type = "object";
        }
        switch (_type) {
          case "object":
            if (type(value.serialize) === "function") {
              parent[key] = value.serialize();
            } else {
              pairs.push(
                ...Object.keys(value).filter((key2) => SERIALIZABLE_TYPES.has(type(value[key2]))).map((key2) => [value, key2])
              );
            }
            break;
          case "function":
            delete parent[key];
            break;
          case "array":
            pairs.push(
              ...value.filter((value2) => SERIALIZABLE_TYPES.has(type(value2))).map((value2, index) => [value2, index])
            );
            break;
        }
      }
      /**
       * Modifies this object *in place* (for theoretical memory consumption &
       * performance reasons); serializes `SerializableEvent#originalValue` (placing
       * the result in `SerializableEvent#data`) and `SerializableEvent#error`.
       * Freezes this object. The result is an object that can be transmitted over
       * IPC.
       * If this quickly becomes unmaintainable, we will want to move towards immutable
       * objects post-haste.
       */
      serialize() {
        const originalValue = this.originalValue;
        const result = Object.assign(/* @__PURE__ */ Object.create(null), {
          data: type(originalValue) === "object" && type(originalValue.serialize) === "function" ? originalValue.serialize() : originalValue,
          error: this.originalError
        });
        breakCircularDeps(result.error);
        const pairs = Object.keys(result).map((key) => [result, key]);
        const seenPairs = /* @__PURE__ */ new Set();
        let pair;
        while (pair = pairs.shift()) {
          if (seenPairs.has(pair[1])) {
            continue;
          }
          seenPairs.add(pair[1]);
          _SerializableEvent._serialize(pairs, ...pair);
        }
        this.data = result.data;
        this.error = result.error;
        return Object.freeze(this);
      }
      /**
       * Used internally by {@link SerializableEvent.deserialize}; creates an `Error`
       * from an `Error`-like (serialized) object
       * @ignore
       * @param {Object} value - An Error-like value
       * @returns {Error} Real error
       */
      static _deserializeError(value) {
        const error = new Error(value.message);
        error.stack = value.stack;
        Object.assign(error, value);
        delete error.__type;
        return error;
      }
      /**
       * Used internally by {@link SerializableEvent.deserialize}; recursively
       * deserializes an object in-place.
       * @param {object|Array} parent - Some object or array
       * @param {string|number} key - Some prop name or array index within `parent`
       */
      static _deserializeObject(parent, key) {
        if (key === "__proto__") {
          delete parent[key];
          return;
        }
        const value = parent[key];
        if (type(key) === "string" && key.startsWith("$$")) {
          const newKey = key.slice(2);
          parent[newKey] = () => value;
          delete parent[key];
          key = newKey;
        }
        if (type(value) === "array") {
          value.forEach((_, idx) => {
            _SerializableEvent._deserializeObject(value, idx);
          });
        } else if (type(value) === "object") {
          if (value.__type === "Error") {
            parent[key] = _SerializableEvent._deserializeError(value);
          } else {
            Object.keys(value).forEach((key2) => {
              _SerializableEvent._deserializeObject(value, key2);
            });
          }
        }
      }
      /**
       * Deserialize value returned from a worker into something more useful.
       * Does not return the same object.
       * @todo do this in a loop instead of with recursion (if necessary)
       * @param {SerializedEvent} obj - Object returned from worker
       * @returns {SerializedEvent} Deserialized result
       */
      static deserialize(obj) {
        if (!obj) {
          throw createInvalidArgumentTypeError("Expected value", obj);
        }
        obj = Object.assign(/* @__PURE__ */ Object.create(null), obj);
        if (obj.data) {
          Object.keys(obj.data).forEach((key) => {
            _SerializableEvent._deserializeObject(obj.data, key);
          });
        }
        if (obj.error) {
          obj.error = _SerializableEvent._deserializeError(obj.error);
        }
        return obj;
      }
    };
    exports2.serialize = function serialize(value) {
      const result = type(value) === "object" && type(value.serialize) === "function" ? value.serialize() : value;
      debug("serialized: %O", result);
      return result;
    };
    exports2.deserialize = function deserialize(value) {
      const result = SerializableWorkerResult.isSerializedWorkerResult(value) ? SerializableWorkerResult.deserialize(value) : value;
      debug("deserialized: %O", result);
      return result;
    };
    exports2.SerializableEvent = SerializableEvent;
    exports2.SerializableWorkerResult = SerializableWorkerResult;
  }
});

// node_modules/mocha/lib/nodejs/buffered-worker-pool.js
var require_buffered_worker_pool = __commonJS({
  "node_modules/mocha/lib/nodejs/buffered-worker-pool.js"(exports2) {
    "use strict";
    var serializeJavascript = require_serialize_javascript();
    var workerpool = require_src2();
    var { deserialize } = require_serializer();
    var debug = require_src()("mocha:parallel:buffered-worker-pool");
    var { createInvalidArgumentTypeError } = require_errors();
    var WORKER_PATH = require.resolve("./worker.js");
    var optionsCache = /* @__PURE__ */ new WeakMap();
    var WORKER_POOL_DEFAULT_OPTS = {
      // use child processes, not worker threads!
      workerType: "process",
      // ensure the same flags sent to `node` for this `mocha` invocation are passed
      // along to children
      forkOpts: { execArgv: process.execArgv },
      maxWorkers: workerpool.cpus - 1
    };
    var BufferedWorkerPool = class _BufferedWorkerPool {
      /**
       * Creates an underlying worker pool instance; determines max worker count
       * @param {Partial<WorkerPoolOptions>} [opts] - Options
       */
      constructor(opts = {}) {
        const maxWorkers = Math.max(
          1,
          typeof opts.maxWorkers === "undefined" ? WORKER_POOL_DEFAULT_OPTS.maxWorkers : opts.maxWorkers
        );
        if (workerpool.cpus < 2) {
          debug(
            "not enough CPU cores available to run multiple jobs; avoid --parallel on this machine"
          );
        } else if (maxWorkers >= workerpool.cpus) {
          debug(
            "%d concurrent job(s) requested, but only %d core(s) available",
            maxWorkers,
            workerpool.cpus
          );
        }
        debug(
          "run(): starting worker pool of max size %d, using node args: %s",
          maxWorkers,
          process.execArgv.join(" ")
        );
        let counter = 0;
        const onCreateWorker = ({ forkOpts }) => {
          return {
            forkOpts: {
              ...forkOpts,
              // adds an incremental id to all workers, which can be useful to allocate resources for each process
              env: { ...process.env, MOCHA_WORKER_ID: counter++ }
            }
          };
        };
        this.options = {
          ...WORKER_POOL_DEFAULT_OPTS,
          ...opts,
          maxWorkers,
          onCreateWorker
        };
        this._pool = workerpool.pool(WORKER_PATH, this.options);
      }
      /**
       * Terminates all workers in the pool.
       * @param {boolean} [force] - Whether to force-kill workers. By default, lets workers finish their current task before termination.
       * @private
       * @returns {Promise<void>}
       */
      async terminate(force = false) {
        debug("terminate(): terminating with force = %s", force);
        return this._pool.terminate(force);
      }
      /**
       * Adds a test file run to the worker pool queue for execution by a worker process.
       *
       * Handles serialization/deserialization.
       *
       * @param {string} filepath - Filepath of test
       * @param {MochaOptions} [options] - Options for Mocha instance
       * @private
       * @returns {Promise<SerializedWorkerResult>}
       */
      async run(filepath, options = {}) {
        if (!filepath || typeof filepath !== "string") {
          throw createInvalidArgumentTypeError(
            "Expected a non-empty filepath",
            "filepath",
            "string"
          );
        }
        const serializedOptions = _BufferedWorkerPool.serializeOptions(options);
        const result = await this._pool.exec("run", [filepath, serializedOptions]);
        return deserialize(result);
      }
      /**
       * Returns stats about the state of the worker processes in the pool.
       *
       * Used for debugging.
       *
       * @private
       */
      stats() {
        return this._pool.stats();
      }
      /**
       * Instantiates a {@link WorkerPool}.
       * @private
       */
      static create(...args) {
        return new _BufferedWorkerPool(...args);
      }
      /**
       * Given Mocha options object `opts`, serialize into a format suitable for
       * transmission over IPC.
       *
       * @param {MochaOptions} [opts] - Mocha options
       * @private
       * @returns {string} Serialized options
       */
      static serializeOptions(opts = {}) {
        if (!optionsCache.has(opts)) {
          const serialized = serializeJavascript(opts, {
            unsafe: true,
            // this means we don't care about XSS
            ignoreFunction: true
            // do not serialize functions
          });
          optionsCache.set(opts, serialized);
          debug(
            "serializeOptions(): serialized options %O to: %s",
            opts,
            serialized
          );
        }
        return optionsCache.get(opts);
      }
      /**
       * Resets internal cache of serialized options objects.
       *
       * For testing/debugging
       * @private
       */
      static resetOptionsCache() {
        optionsCache = /* @__PURE__ */ new WeakMap();
      }
    };
    exports2.BufferedWorkerPool = BufferedWorkerPool;
  }
});

// node_modules/mocha/lib/nodejs/parallel-buffered-runner.js
var require_parallel_buffered_runner = __commonJS({
  "node_modules/mocha/lib/nodejs/parallel-buffered-runner.js"(exports2, module2) {
    "use strict";
    var Runner = require_runner();
    var { EVENT_RUN_BEGIN, EVENT_RUN_END } = Runner.constants;
    var debug = require_src()("mocha:parallel:parallel-buffered-runner");
    var { BufferedWorkerPool } = require_buffered_worker_pool();
    var { setInterval, clearInterval } = global;
    var { createMap, constants } = require_utils();
    var { MOCHA_ID_PROP_NAME } = constants;
    var { createFatalError } = require_errors();
    var DEFAULT_WORKER_REPORTER = require.resolve("./reporters/parallel-buffered");
    var DENY_OPTIONS = [
      "globalSetup",
      "globalTeardown",
      "parallel",
      "p",
      "jobs",
      "j"
    ];
    var debugStats = (pool) => {
      const { totalWorkers, busyWorkers, idleWorkers, pendingTasks } = pool.stats();
      debug(
        "%d/%d busy workers; %d idle; %d tasks queued",
        busyWorkers,
        totalWorkers,
        idleWorkers,
        pendingTasks
      );
    };
    var DEBUG_STATS_INTERVAL = 5e3;
    var ABORTED = "ABORTED";
    var IDLE = "IDLE";
    var ABORTING = "ABORTING";
    var RUNNING = "RUNNING";
    var BAILING = "BAILING";
    var BAILED = "BAILED";
    var COMPLETE = "COMPLETE";
    var states = createMap({
      [IDLE]: /* @__PURE__ */ new Set([RUNNING, ABORTING]),
      [RUNNING]: /* @__PURE__ */ new Set([COMPLETE, BAILING, ABORTING]),
      [COMPLETE]: /* @__PURE__ */ new Set(),
      [ABORTED]: /* @__PURE__ */ new Set(),
      [ABORTING]: /* @__PURE__ */ new Set([ABORTED]),
      [BAILING]: /* @__PURE__ */ new Set([BAILED, ABORTING]),
      [BAILED]: /* @__PURE__ */ new Set([COMPLETE, ABORTING])
    });
    var ParallelBufferedRunner = class extends Runner {
      constructor(...args) {
        super(...args);
        let state = IDLE;
        Object.defineProperty(this, "_state", {
          get() {
            return state;
          },
          set(newState) {
            if (states[state].has(newState)) {
              state = newState;
            } else {
              throw new Error(`invalid state transition: ${state} => ${newState}`);
            }
          }
        });
        this._workerReporter = DEFAULT_WORKER_REPORTER;
        this._linkPartialObjects = false;
        this._linkedObjectMap = /* @__PURE__ */ new Map();
        this.once(Runner.constants.EVENT_RUN_END, () => {
          this._state = COMPLETE;
        });
      }
      /**
       * Returns a mapping function to enqueue a file in the worker pool and return results of its execution.
       * @param {BufferedWorkerPool} pool - Worker pool
       * @param {RunnerOptions} options - Mocha options
       * @returns {FileRunner} Mapping function
       * @private
       */
      _createFileRunner(pool, options) {
        const emitEvent = (event, failureCount) => {
          this.emit(event.eventName, event.data, event.error);
          if (this._state !== BAILING && event.data && event.data._bail && (failureCount || event.error)) {
            debug("run(): nonzero failure count & found bail flag");
            this._state = BAILING;
          }
        };
        const linkEvent = (event) => {
          const stack = [{ parent: event, prop: "data" }];
          while (stack.length) {
            const { parent, prop } = stack.pop();
            const obj = parent[prop];
            let newObj;
            if (obj && typeof obj === "object") {
              if (obj[MOCHA_ID_PROP_NAME]) {
                const id = obj[MOCHA_ID_PROP_NAME];
                newObj = this._linkedObjectMap.has(id) ? Object.assign(this._linkedObjectMap.get(id), obj) : obj;
                this._linkedObjectMap.set(id, newObj);
                parent[prop] = newObj;
              } else {
                throw createFatalError(
                  "Object missing ID received in event data",
                  obj
                );
              }
            }
            Object.keys(newObj).forEach((key) => {
              const value = obj[key];
              if (value && typeof value === "object" && value[MOCHA_ID_PROP_NAME]) {
                stack.push({ obj: value, parent: newObj, prop: key });
              }
            });
          }
        };
        return async (file) => {
          debug("run(): enqueueing test file %s", file);
          try {
            const { failureCount, events } = await pool.run(file, options);
            if (this._state === BAILED) {
              return;
            }
            debug(
              "run(): completed run of file %s; %d failures / %d events",
              file,
              failureCount,
              events.length
            );
            this.failures += failureCount;
            let event = events.shift();
            if (this._linkPartialObjects) {
              while (event) {
                linkEvent(event);
                emitEvent(event, failureCount);
                event = events.shift();
              }
            } else {
              while (event) {
                emitEvent(event, failureCount);
                event = events.shift();
              }
            }
            if (this._state === BAILING) {
              debug('run(): terminating pool due to "bail" flag');
              this._state = BAILED;
              await pool.terminate();
            }
          } catch (err) {
            if (this._state === BAILED || this._state === ABORTING) {
              debug(
                "run(): worker pool terminated with intent; skipping file %s",
                file
              );
            } else {
              debug("run(): encountered uncaught exception: %O", err);
              if (this.allowUncaught) {
                this._state = ABORTING;
                await pool.terminate(true);
              }
              throw err;
            }
          } finally {
            debug("run(): done running file %s", file);
          }
        };
      }
      /**
       * Listen on `Process.SIGINT`; terminate pool if caught.
       * Returns the listener for later call to `process.removeListener()`.
       * @param {BufferedWorkerPool} pool - Worker pool
       * @returns {SigIntListener} Listener
       * @private
       */
      _bindSigIntListener(pool) {
        const sigIntListener = async () => {
          debug("run(): caught a SIGINT");
          this._state = ABORTING;
          try {
            debug("run(): force-terminating worker pool");
            await pool.terminate(true);
          } catch (err) {
            console.error(
              `Error while attempting to force-terminate worker pool: ${err}`
            );
            process.exitCode = 1;
          } finally {
            process.nextTick(() => {
              debug("run(): imminent death");
              this._state = ABORTED;
              process.kill(process.pid, "SIGINT");
            });
          }
        };
        process.once("SIGINT", sigIntListener);
        return sigIntListener;
      }
      /**
       * Runs Mocha tests by creating a thread pool, then delegating work to the
       * worker threads.
       *
       * Each worker receives one file, and as workers become available, they take a
       * file from the queue and run it. The worker thread execution is treated like
       * an RPC--it returns a `Promise` containing serialized information about the
       * run.  The information is processed as it's received, and emitted to a
       * {@link Reporter}, which is likely listening for these events.
       *
       * @param {Function} callback - Called with an exit code corresponding to
       * number of test failures.
       * @param {RunnerOptions} [opts] - options
       */
      run(callback, { files, options = {} } = {}) {
        let sigIntListener;
        options = { ...options, reporter: this._workerReporter };
        (async () => {
          let debugInterval;
          let pool;
          try {
            pool = BufferedWorkerPool.create({ maxWorkers: options.jobs });
            sigIntListener = this._bindSigIntListener(pool);
            debugInterval = setInterval(
              () => debugStats(pool),
              DEBUG_STATS_INTERVAL
            ).unref();
            this.started = true;
            this._state = RUNNING;
            this.emit(EVENT_RUN_BEGIN);
            options = { ...options };
            DENY_OPTIONS.forEach((opt) => {
              delete options[opt];
            });
            const results = await Promise.allSettled(
              files.map(this._createFileRunner(pool, options))
            );
            await pool.terminate();
            results.filter(({ status }) => status === "rejected").forEach(({ reason }) => {
              if (this.allowUncaught) {
                throw reason;
              }
              this.uncaught(reason);
            });
            if (this._state === ABORTING) {
              return;
            }
            this.emit(EVENT_RUN_END);
            debug("run(): completing with failure count %d", this.failures);
            callback(this.failures);
          } catch (err) {
            process.nextTick(() => {
              debug("run(): re-throwing uncaught exception");
              throw err;
            });
          } finally {
            clearInterval(debugInterval);
            process.removeListener("SIGINT", sigIntListener);
          }
        })();
        return this;
      }
      /**
       * Toggle partial object linking behavior; used for building object references from
       * unique ID's.
       * @param {boolean} [value] - If `true`, enable partial object linking, otherwise disable
       * @returns {Runner}
       * @chainable
       * @public
       * @example
       * // this reporter needs proper object references when run in parallel mode
       * class MyReporter() {
       *   constructor(runner) {
       *     runner.linkPartialObjects(true)
       *       .on(EVENT_SUITE_BEGIN, suite => {
       *         // this Suite may be the same object...
       *       })
       *       .on(EVENT_TEST_BEGIN, test => {
       *         // ...as the `test.parent` property
       *       });
       *   }
       * }
       */
      linkPartialObjects(value) {
        this._linkPartialObjects = Boolean(value);
        return super.linkPartialObjects(value);
      }
      /**
       * If this class is the `Runner` in use, then this is going to return `true`.
       *
       * For use by reporters.
       * @returns {true}
       * @public
       */
      isParallelMode() {
        return true;
      }
      /**
       * Configures an alternate reporter for worker processes to use. Subclasses
       * using worker processes should implement this.
       * @public
       * @param {string} path - Absolute path to alternate reporter for worker processes to use
       * @returns {Runner}
       * @throws When in serial mode
       * @chainable
       */
      workerReporter(reporter) {
        this._workerReporter = reporter;
        return this;
      }
    };
    module2.exports = ParallelBufferedRunner;
  }
});

// node_modules/mocha/lib/mocha.js
var require_mocha = __commonJS({
  "node_modules/mocha/lib/mocha.js"(exports2, module2) {
    "use strict";
    var escapeRe = require_escape_string_regexp();
    var path2 = require("node:path");
    var builtinReporters = require_reporters();
    var utils = require_utils();
    var mocharc = require_mocharc();
    var Suite = require_suite();
    var esmUtils = require_esm_utils();
    var createStatsCollector = require_stats_collector();
    var {
      createInvalidReporterError,
      createInvalidInterfaceError,
      createMochaInstanceAlreadyDisposedError,
      createMochaInstanceAlreadyRunningError,
      createUnsupportedError
    } = require_errors();
    var { EVENT_FILE_PRE_REQUIRE, EVENT_FILE_POST_REQUIRE, EVENT_FILE_REQUIRE } = Suite.constants;
    var debug = require_src()("mocha:mocha");
    exports2 = module2.exports = Mocha2;
    var mochaStates = utils.defineConstants({
      /**
       * Initial state of the mocha instance
       * @private
       */
      INIT: "init",
      /**
       * Mocha instance is running tests
       * @private
       */
      RUNNING: "running",
      /**
       * Mocha instance is done running tests and references to test functions and hooks are cleaned.
       * You can reset this state by unloading the test files.
       * @private
       */
      REFERENCES_CLEANED: "referencesCleaned",
      /**
       * Mocha instance is disposed and can no longer be used.
       * @private
       */
      DISPOSED: "disposed"
    });
    if (!utils.isBrowser() && typeof module2.paths !== "undefined") {
      cwd = utils.cwd();
      module2.paths.push(cwd, path2.join(cwd, "node_modules"));
    }
    var cwd;
    exports2.utils = utils;
    exports2.interfaces = require_interfaces();
    exports2.reporters = builtinReporters;
    exports2.Runnable = require_runnable();
    exports2.Context = require_context();
    exports2.Runner = require_runner();
    exports2.Suite = Suite;
    exports2.Hook = require_hook();
    exports2.Test = require_test();
    var currentContext;
    exports2.afterEach = function(...args) {
      return (currentContext.afterEach || currentContext.teardown).apply(
        this,
        args
      );
    };
    exports2.after = function(...args) {
      return (currentContext.after || currentContext.suiteTeardown).apply(
        this,
        args
      );
    };
    exports2.beforeEach = function(...args) {
      return (currentContext.beforeEach || currentContext.setup).apply(this, args);
    };
    exports2.before = function(...args) {
      return (currentContext.before || currentContext.suiteSetup).apply(this, args);
    };
    exports2.describe = function(...args) {
      return (currentContext.describe || currentContext.suite).apply(this, args);
    };
    exports2.describe.only = function(...args) {
      return (currentContext.describe || currentContext.suite).only.apply(
        this,
        args
      );
    };
    exports2.describe.skip = function(...args) {
      return (currentContext.describe || currentContext.suite).skip.apply(
        this,
        args
      );
    };
    exports2.it = function(...args) {
      return (currentContext.it || currentContext.test).apply(this, args);
    };
    exports2.it.only = function(...args) {
      return (currentContext.it || currentContext.test).only.apply(this, args);
    };
    exports2.it.skip = function(...args) {
      return (currentContext.it || currentContext.test).skip.apply(this, args);
    };
    exports2.xdescribe = exports2.describe.skip;
    exports2.xit = exports2.it.skip;
    exports2.setup = exports2.beforeEach;
    exports2.suiteSetup = exports2.before;
    exports2.suiteTeardown = exports2.after;
    exports2.suite = exports2.describe;
    exports2.teardown = exports2.afterEach;
    exports2.test = exports2.it;
    exports2.run = function(...args) {
      return currentContext.run.apply(this, args);
    };
    function Mocha2(options = {}) {
      options = { ...mocharc, ...options };
      this.files = [];
      this.options = options;
      this.suite = new exports2.Suite("", new exports2.Context(), true);
      this._cleanReferencesAfterRun = true;
      this._state = mochaStates.INIT;
      this.grep(options.grep).fgrep(options.fgrep).ui(options.ui).reporter(
        options.reporter,
        options["reporter-option"] || options.reporterOption || options.reporterOptions
        // for backwards compatibility
      ).slow(options.slow).global(options.global);
      if (typeof options.timeout !== "undefined") {
        this.timeout(options.timeout === false ? 0 : options.timeout);
      }
      if ("retries" in options) {
        this.retries(options.retries);
      }
      [
        "allowUncaught",
        "asyncOnly",
        "bail",
        "checkLeaks",
        "color",
        "delay",
        "diff",
        "dryRun",
        "passOnFailingTestSuite",
        "failZero",
        "forbidOnly",
        "forbidPending",
        "fullTrace",
        "inlineDiffs",
        "invert"
      ].forEach(function(opt) {
        if (options[opt]) {
          this[opt]();
        }
      }, this);
      if (options.rootHooks) {
        this.rootHooks(options.rootHooks);
      }
      this._runnerClass = exports2.Runner;
      this._lazyLoadFiles = false;
      this.isWorker = Boolean(options.isWorker);
      this.globalSetup(options.globalSetup).globalTeardown(options.globalTeardown).enableGlobalSetup(options.enableGlobalSetup).enableGlobalTeardown(options.enableGlobalTeardown);
      if (options.parallel && (typeof options.jobs === "undefined" || options.jobs > 1)) {
        debug("attempting to enable parallel mode");
        this.parallelMode(true);
      }
    }
    Mocha2.prototype.bail = function(bail) {
      this.suite.bail(bail !== false);
      return this;
    };
    Mocha2.prototype.addFile = function(file) {
      this.files.push(file);
      return this;
    };
    Mocha2.prototype.reporter = function(reporterName, reporterOptions) {
      if (typeof reporterName === "function") {
        this._reporter = reporterName;
      } else {
        reporterName = reporterName || "spec";
        var reporter;
        if (builtinReporters[reporterName]) {
          reporter = builtinReporters[reporterName];
        }
        if (!reporter) {
          let foundReporter;
          try {
            foundReporter = require.resolve(reporterName);
            reporter = require(foundReporter);
          } catch (err) {
            if (foundReporter) {
              throw createInvalidReporterError(err.message, foundReporter);
            }
            try {
              reporter = require(path2.resolve(reporterName));
            } catch (err2) {
              throw createInvalidReporterError(err2.message, reporterName);
            }
          }
        }
        this._reporter = reporter;
      }
      this.options.reporterOption = reporterOptions;
      this.options.reporterOptions = reporterOptions;
      return this;
    };
    Mocha2.prototype.ui = function(ui) {
      var bindInterface;
      if (typeof ui === "function") {
        bindInterface = ui;
      } else {
        ui = ui || "bdd";
        bindInterface = exports2.interfaces[ui];
        if (!bindInterface) {
          try {
            bindInterface = require(ui);
          } catch (err) {
            throw createInvalidInterfaceError(`invalid interface '${ui}'`, ui);
          }
        }
      }
      bindInterface(this.suite);
      this.suite.on(EVENT_FILE_PRE_REQUIRE, function(context) {
        currentContext = context;
      });
      return this;
    };
    Mocha2.prototype.loadFiles = function(fn) {
      var self2 = this;
      var suite = this.suite;
      this.files.forEach(function(file) {
        file = path2.resolve(file);
        suite.emit(EVENT_FILE_PRE_REQUIRE, global, file, self2);
        suite.emit(EVENT_FILE_REQUIRE, require(file), file, self2);
        suite.emit(EVENT_FILE_POST_REQUIRE, global, file, self2);
      });
      fn && fn();
    };
    Mocha2.prototype.loadFilesAsync = function({ esmDecorator } = {}) {
      var self2 = this;
      var suite = this.suite;
      this.lazyLoadFiles(true);
      return esmUtils.loadFilesAsync(
        this.files,
        function(file) {
          suite.emit(EVENT_FILE_PRE_REQUIRE, global, file, self2);
        },
        function(file, resultModule) {
          suite.emit(EVENT_FILE_REQUIRE, resultModule, file, self2);
          suite.emit(EVENT_FILE_POST_REQUIRE, global, file, self2);
        },
        esmDecorator
      );
    };
    Mocha2.unloadFile = function(file) {
      if (utils.isBrowser()) {
        throw createUnsupportedError(
          "unloadFile() is only supported in a Node.js environment"
        );
      }
      return require_file_unloader().unloadFile(file);
    };
    Mocha2.prototype.unloadFiles = function() {
      if (this._state === mochaStates.DISPOSED) {
        throw createMochaInstanceAlreadyDisposedError(
          "Mocha instance is already disposed, it cannot be used again.",
          this._cleanReferencesAfterRun,
          this
        );
      }
      this.files.forEach(function(file) {
        Mocha2.unloadFile(file);
      });
      this._state = mochaStates.INIT;
      return this;
    };
    Mocha2.prototype.fgrep = function(str) {
      if (!str) {
        return this;
      }
      return this.grep(new RegExp(escapeRe(str)));
    };
    Mocha2.prototype.grep = function(re) {
      if (utils.isString(re)) {
        var arg = re.match(/^\/(.*)\/([gimy]{0,4})$|.*/);
        this.options.grep = new RegExp(arg[1] || arg[0], arg[2]);
      } else {
        this.options.grep = re;
      }
      return this;
    };
    Mocha2.prototype.invert = function() {
      this.options.invert = true;
      return this;
    };
    Mocha2.prototype.checkLeaks = function(checkLeaks) {
      this.options.checkLeaks = checkLeaks !== false;
      return this;
    };
    Mocha2.prototype.cleanReferencesAfterRun = function(cleanReferencesAfterRun) {
      this._cleanReferencesAfterRun = cleanReferencesAfterRun !== false;
      return this;
    };
    Mocha2.prototype.dispose = function() {
      if (this._state === mochaStates.RUNNING) {
        throw createMochaInstanceAlreadyRunningError(
          "Cannot dispose while the mocha instance is still running tests."
        );
      }
      this.unloadFiles();
      this._previousRunner && this._previousRunner.dispose();
      this.suite.dispose();
      this._state = mochaStates.DISPOSED;
    };
    Mocha2.prototype.fullTrace = function(fullTrace) {
      this.options.fullTrace = fullTrace !== false;
      return this;
    };
    Mocha2.prototype.global = function(global2) {
      this.options.global = (this.options.global || []).concat(global2).filter(Boolean).filter(function(elt, idx, arr) {
        return arr.indexOf(elt) === idx;
      });
      return this;
    };
    Mocha2.prototype.globals = Mocha2.prototype.global;
    Mocha2.prototype.color = function(color) {
      this.options.color = color !== false;
      return this;
    };
    Mocha2.prototype.inlineDiffs = function(inlineDiffs) {
      this.options.inlineDiffs = inlineDiffs !== false;
      return this;
    };
    Mocha2.prototype.diff = function(diff) {
      this.options.diff = diff !== false;
      return this;
    };
    Mocha2.prototype.timeout = function(msecs) {
      this.suite.timeout(msecs);
      return this;
    };
    Mocha2.prototype.retries = function(retry) {
      this.suite.retries(retry);
      return this;
    };
    Mocha2.prototype.slow = function(msecs) {
      this.suite.slow(msecs);
      return this;
    };
    Mocha2.prototype.asyncOnly = function(asyncOnly) {
      this.options.asyncOnly = asyncOnly !== false;
      return this;
    };
    Mocha2.prototype.noHighlighting = function() {
      this.options.noHighlighting = true;
      return this;
    };
    Mocha2.prototype.allowUncaught = function(allowUncaught) {
      this.options.allowUncaught = allowUncaught !== false;
      return this;
    };
    Mocha2.prototype.delay = function delay() {
      this.options.delay = true;
      return this;
    };
    Mocha2.prototype.dryRun = function(dryRun) {
      this.options.dryRun = dryRun !== false;
      return this;
    };
    Mocha2.prototype.failZero = function(failZero) {
      this.options.failZero = failZero !== false;
      return this;
    };
    Mocha2.prototype.passOnFailingTestSuite = function(passOnFailingTestSuite) {
      this.options.passOnFailingTestSuite = passOnFailingTestSuite === true;
      return this;
    };
    Mocha2.prototype.forbidOnly = function(forbidOnly) {
      this.options.forbidOnly = forbidOnly !== false;
      return this;
    };
    Mocha2.prototype.forbidPending = function(forbidPending) {
      this.options.forbidPending = forbidPending !== false;
      return this;
    };
    Mocha2.prototype._guardRunningStateTransition = function() {
      if (this._state === mochaStates.RUNNING) {
        throw createMochaInstanceAlreadyRunningError(
          "Mocha instance is currently running tests, cannot start a next test run until this one is done",
          this
        );
      }
      if (this._state === mochaStates.DISPOSED || this._state === mochaStates.REFERENCES_CLEANED) {
        throw createMochaInstanceAlreadyDisposedError(
          "Mocha instance is already disposed, cannot start a new test run. Please create a new mocha instance. Be sure to set disable `cleanReferencesAfterRun` when you want to reuse the same mocha instance for multiple test runs.",
          this._cleanReferencesAfterRun,
          this
        );
      }
    };
    Object.defineProperty(Mocha2.prototype, "version", {
      value: require_package().version,
      configurable: false,
      enumerable: true,
      writable: false
    });
    Mocha2.prototype.run = function(fn) {
      this._guardRunningStateTransition();
      this._state = mochaStates.RUNNING;
      if (this._previousRunner) {
        this._previousRunner.dispose();
        this.suite.reset();
      }
      if (this.files.length && !this._lazyLoadFiles) {
        this.loadFiles();
      }
      var suite = this.suite;
      var options = this.options;
      options.files = this.files;
      const runner = new this._runnerClass(suite, {
        cleanReferencesAfterRun: this._cleanReferencesAfterRun,
        delay: options.delay,
        dryRun: options.dryRun,
        failZero: options.failZero
      });
      createStatsCollector(runner);
      var reporter = new this._reporter(runner, options);
      runner.checkLeaks = options.checkLeaks === true;
      runner.fullStackTrace = options.fullTrace;
      runner.asyncOnly = options.asyncOnly;
      runner.allowUncaught = options.allowUncaught;
      runner.forbidOnly = options.forbidOnly;
      runner.forbidPending = options.forbidPending;
      if (options.grep) {
        runner.grep(options.grep, options.invert);
      }
      if (options.global) {
        runner.globals(options.global);
      }
      if (options.color !== void 0) {
        exports2.reporters.Base.useColors = options.color;
      }
      exports2.reporters.Base.inlineDiffs = options.inlineDiffs;
      exports2.reporters.Base.hideDiff = !options.diff;
      const done = (failures) => {
        this._previousRunner = runner;
        this._state = this._cleanReferencesAfterRun ? mochaStates.REFERENCES_CLEANED : mochaStates.INIT;
        fn = fn || utils.noop;
        if (typeof reporter.done === "function") {
          reporter.done(failures, fn);
        } else {
          fn(failures);
        }
      };
      const runAsync = async (runner2) => {
        const context = this.options.enableGlobalSetup && this.hasGlobalSetupFixtures() ? await this.runGlobalSetup(runner2) : {};
        const failureCount = await runner2.runAsync({
          files: this.files,
          options
        });
        if (this.options.enableGlobalTeardown && this.hasGlobalTeardownFixtures()) {
          await this.runGlobalTeardown(runner2, { context });
        }
        return failureCount;
      };
      runAsync(runner).then(done);
      return runner;
    };
    Mocha2.prototype.rootHooks = function rootHooks({
      beforeAll = [],
      beforeEach = [],
      afterAll = [],
      afterEach = []
    } = {}) {
      beforeAll = utils.castArray(beforeAll);
      beforeEach = utils.castArray(beforeEach);
      afterAll = utils.castArray(afterAll);
      afterEach = utils.castArray(afterEach);
      beforeAll.forEach((hook) => {
        this.suite.beforeAll(hook);
      });
      beforeEach.forEach((hook) => {
        this.suite.beforeEach(hook);
      });
      afterAll.forEach((hook) => {
        this.suite.afterAll(hook);
      });
      afterEach.forEach((hook) => {
        this.suite.afterEach(hook);
      });
      return this;
    };
    Mocha2.prototype.parallelMode = function parallelMode(enable = true) {
      if (utils.isBrowser()) {
        throw createUnsupportedError("parallel mode is only supported in Node.js");
      }
      const parallel = Boolean(enable);
      if (parallel === this.options.parallel && this._lazyLoadFiles && this._runnerClass !== exports2.Runner) {
        return this;
      }
      if (this._state !== mochaStates.INIT) {
        throw createUnsupportedError(
          "cannot change parallel mode after having called run()"
        );
      }
      this.options.parallel = parallel;
      this._runnerClass = parallel ? require_parallel_buffered_runner() : exports2.Runner;
      return this.lazyLoadFiles(this._lazyLoadFiles || parallel);
    };
    Mocha2.prototype.lazyLoadFiles = function lazyLoadFiles(enable) {
      this._lazyLoadFiles = enable === true;
      debug("set lazy load to %s", enable);
      return this;
    };
    Mocha2.prototype.globalSetup = function globalSetup(setupFns = []) {
      setupFns = utils.castArray(setupFns);
      this.options.globalSetup = setupFns;
      debug("configured %d global setup functions", setupFns.length);
      return this;
    };
    Mocha2.prototype.globalTeardown = function globalTeardown(teardownFns = []) {
      teardownFns = utils.castArray(teardownFns);
      this.options.globalTeardown = teardownFns;
      debug("configured %d global teardown functions", teardownFns.length);
      return this;
    };
    Mocha2.prototype.runGlobalSetup = async function runGlobalSetup(context = {}) {
      const { globalSetup } = this.options;
      if (globalSetup && globalSetup.length) {
        debug("run(): global setup starting");
        await this._runGlobalFixtures(globalSetup, context);
        debug("run(): global setup complete");
      }
      return context;
    };
    Mocha2.prototype.runGlobalTeardown = async function runGlobalTeardown(context = {}) {
      const { globalTeardown } = this.options;
      if (globalTeardown && globalTeardown.length) {
        debug("run(): global teardown starting");
        await this._runGlobalFixtures(globalTeardown, context);
      }
      debug("run(): global teardown complete");
      return context;
    };
    Mocha2.prototype._runGlobalFixtures = async function _runGlobalFixtures(fixtureFns = [], context = {}) {
      for await (const fixtureFn of fixtureFns) {
        await fixtureFn.call(context);
      }
      return context;
    };
    Mocha2.prototype.enableGlobalSetup = function enableGlobalSetup(enabled = true) {
      this.options.enableGlobalSetup = Boolean(enabled);
      return this;
    };
    Mocha2.prototype.enableGlobalTeardown = function enableGlobalTeardown(enabled = true) {
      this.options.enableGlobalTeardown = Boolean(enabled);
      return this;
    };
    Mocha2.prototype.hasGlobalSetupFixtures = function hasGlobalSetupFixtures() {
      return Boolean(this.options.globalSetup.length);
    };
    Mocha2.prototype.hasGlobalTeardownFixtures = function hasGlobalTeardownFixtures() {
      return Boolean(this.options.globalTeardown.length);
    };
  }
});

// node_modules/mocha/index.js
var require_mocha2 = __commonJS({
  "node_modules/mocha/index.js"(exports2, module2) {
    "use strict";
    module2.exports = require_mocha();
  }
});

// src/test/e2e/index.ts
var index_exports = {};
__export(index_exports, {
  run: () => run
});
module.exports = __toCommonJS(index_exports);
var path = __toESM(require("node:path"));
var import_mocha = __toESM(require_mocha2());
function run() {
  const mocha = new import_mocha.default({
    ui: "bdd",
    color: true,
    timeout: 18e4,
    reporter: "spec"
  });
  mocha.addFile(path.resolve(__dirname, "extension.test.js"));
  return new Promise((resolve2, reject) => {
    try {
      mocha.run((failures) => {
        if (failures > 0) {
          reject(new Error(`${failures} tests failed.`));
        } else {
          resolve2();
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  run
});
/*! Bundled license information:

he/he.js:
  (*! https://mths.be/he v1.2.0 by @mathias | MIT license *)

mocha/lib/mocha.js:
  (*!
   * mocha
   * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
   * MIT Licensed
   *)
*/
//# sourceMappingURL=index.js.map
