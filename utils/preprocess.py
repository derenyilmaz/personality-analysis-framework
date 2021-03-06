import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname("__file__"), '..')))

import re
import string


from utils.stopwords import * 
from utils.emoji import *
#from twitter.turkish import * 

emoji_util = Emoji()

def preprocess(text):
    # remove emojis and count smiling and negative ones
    smiling = emoji_util.get_smiling_emoji_count(text)
    negative = emoji_util.get_negative_emoji_count(text)
    text = emoji_util.remove_emoji(text)

    # removing line breaks
    text = text.replace('\n', ' ').replace('\r', '')
    
    # removing the hashtag sign
    text = text.replace("#", "")

    # removing the RT keyword that gets added automatically when a RT'd tweet is fetched via the API
    # RT @username: original_tweet
    regex = r"^RT @[A-Za-z0-9_]{1,}: (.*?)$"
    rt_search = re.search(regex, text, flags=re.S)
    if rt_search:
        rts = rt_search.groups()
        text = rts[0]

    # removing mentions
    # username details: https://help.twitter.com/en/managing-your-account/twitter-username-rules
    # username limit: 15 chars
    # [A-Za-z], [0-9], [_]
    # regex for mentions => @[A-Za-z0-9_]{1,15}
    # this is a bit tricky because if we remove everything starting with @, we might remove non-valid usernames as well.
    # removing mentions without the username length restriction
    regex = r"@[A-Za-z0-9_]{1,}"
    text = re.sub(regex, '', text)

    # twitter uses t.co for url's so we can use a regex to match that only if the api gets stuff with t.co 
    # for example https://t.co/BLABLA
    # removing URL's 
    #regex = r"(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,8}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)"
    regex = r"(http(s)?:\/\/t.co\/)[a-zA-Z0-9]+"
    text = re.sub(regex, '', text)
    
    # removing stopwords and extra spaces
    s = StopWord()
    s_s = text.split()
    r = [i for i in s_s if s.is_stop_word(i) is False]
    text = ' '.join(r)
    return (text, smiling, negative)


if __name__ == '__main__':
    text = input()
    print("input: \n" + text + "\n" + "-" * 80)
    tt = preprocess(text)
    print("output: \n" + tt + "\n" + "-" * 80)

