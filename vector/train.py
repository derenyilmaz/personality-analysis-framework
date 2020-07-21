#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import print_function
import os.path
import sys
from gensim.corpora import WikiCorpus
import xml.etree.ElementTree as etree
import warnings
import logging
import string
from gensim import utils
import logging
import sys
import multiprocessing

from gensim.models import Word2Vec
from gensim.models.word2vec import LineSentence


def tokenize_tr(content,token_min_len=2,token_max_len=50,lower=True):
    if lower:
        lowerMap = {ord(u'A'): u'a',ord(u'A'): u'a',ord(u'B'): u'b',ord(u'C'): u'c',ord(u'Ç'): u'ç',ord(u'D'): u'd',ord(u'E'): u'e',ord(u'F'): u'f',ord(u'G'): u'g',ord(u'Ğ'): u'ğ',ord(u'H'): u'h',ord(u'I'): u'ı',ord(u'İ'): u'i',ord(u'J'): u'j',ord(u'K'): u'k',ord(u'L'): u'l',ord(u'M'): u'm',ord(u'N'): u'n',ord(u'O'): u'o',ord(u'Ö'): u'ö',ord(u'P'): u'p',ord(u'R'): u'r',ord(u'S'): u's',ord(u'Ş'): u'ş',ord(u'T'): u't',ord(u'U'): u'u',ord(u'Ü'): u'ü',ord(u'V'): u'v',ord(u'Y'): u'y',ord(u'Z'): u'z'}
        content = content.translate(lowerMap)
    return [
    utils.to_unicode(token) for token in utils.tokenize(content, lower=False, errors='ignore')
    if token_min_len <= len(token) <= token_max_len and not token.startswith('_')
    ]

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')

inputFile = "trwiki-latest-pages-articles.xml.bz2"
outputFile = "wikipedia-out.txt"

wiki = WikiCorpus(inputFile, lemmatize=False,tokenizer_func = tokenize_tr)
logging.info("Wikipedia dump is opened.")
output = open(outputFile,"w",encoding="utf-8")
logging.info("Output file is created.")

i = 0
for text in wiki.get_texts():
    output.write(" ".join(text)+"\n")
    i+=1
    if (i % 10000 == 0):
        logging.info("Saved " +str(i) + " articles.")

output.close()

inputFile = "wikipedia-out.txt"
outputFile = "wikipedia-out-vector.txt"

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')

model = Word2Vec(LineSentence(inputFile), size=400, window=5, min_count=5, workers=multiprocessing.cpu_count())
model.wv.save_word2vec_format(outputFile, binary=True)