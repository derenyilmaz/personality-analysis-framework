import sys
import re

import json
import requests

import numpy as np
from sklearn.preprocessing import KBinsDiscretizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.feature_extraction.text import CountVectorizer

import twitter.download
import utils.preprocess
import zemberek
from vector import vector

def calculate_vector(username, from_file = False, debug = False, verbose = False):
    
    # Data Collection

    if from_file is True:
        all_tweets = twitter.download.read_csv(username)
    else :
        all_tweets = twitter.download.get_all_tweets(username, debug, False, verbose)

    # Data Preprocess

    ## Preprocess

    preprocessed = [tweet.map_tweet(utils.preprocess.preprocess) for tweet in all_tweets]

    ## Normalization

    normalized = []
    for tweet in preprocessed:
        try :
            lang_id = zemberek.find_lang_id(tweet.get_tweet())
            if lang_id == "tr":
                # continue, tweet is turkish
                n_response = zemberek.normalize(tweet.get_tweet())
                if n_response.normalized_input:
                    tweet.set_normalized_tweet(n_response.normalized_input)
                    normalized.append(tweet)
                else:
                    # not sure if raising an error will cause the halting of the app, if that's the case, we can use a simple print for debugging purposes.
                    raise AttributeError('Problem normalizing input : ' + n_response.error)
            else :
                # do not handle, tweet is turkish
                pass
        except zemberek.grpc._channel._InactiveRpcError:
            print("Cannot communicate with Zemberek, exiting while normalizing.")
            exit()

    ## Lemmatization

    for tweet in normalized:
        try:
            analysis_result = zemberek.analyze(tweet.get_normalized_tweet())
            tweet_lemmas = []
            tweet_pos = []
            tweet_plural = 0
            tweet_words = 0
            tweet_full_stop = 0
            tweet_unknown = 0
            plural_regex = r"A[1-3]pl"
            for a in analysis_result.results:
                best = a.best
                lemmas = ""
                for l in best.lemmas:
                    if l != "UNK":
                        tweet_lemmas.append(l)
                        tweet_pos.append(best.pos)
                    else :
                        tweet_unknown += 1
                    if re.search(plural_regex, best.analysis, flags = re.S) is not None:
                        tweet_plural += 1
                if a.token == ".":
                    tweet_full_stop += 1
                tweet_words += 1

            for i in tweet_pos:
                tweet.add_pos(i)
            tweet.set_pos("Plur", tweet_plural)
            tweet.set_pos("Word", tweet_words)
            tweet.set_pos("Fstop", tweet_full_stop)
            tweet.set_pos("Inc", tweet_unknown)
            tweet.set_lemma(set(tweet_lemmas))

        except zemberek.grpc._channel._InactiveRpcError:
            print("Cannot communicate with Zemberek, exiting while analyzing.")
            exit()

    # Vector Construction

    for tweet in normalized:
        v = vector.Vector()
        v.set_vector(tweet)
        tweet.set_vector(v)

    ## Feature Extraction
    ## Feature Reduction
    ## Normalization

    sum_vector = np.array([0] * 20)

    sum_lemmas = []

    for tweet in normalized:
        lemma_list = list(tweet.get_lemma())
        sum_lemmas += lemma_list
        v = np.array(tweet.get_vector().get_vector())
        sum_vector = np.add(sum_vector, v)        
    
    sum_transformed = sum_vector.reshape(-1, 1)
    normalized = KBinsDiscretizer(n_bins = [4], encode = 'ordinal').fit(sum_transformed).transform(sum_transformed)
    normalized = normalized/4.

    if verbose is True:
        print(normalized.reshape(1, 20))
        print(sum_lemmas)

    ## TF-IDF Weighting and Word2Vec based Word Embedding

    cv = CountVectorizer(max_features = 20, ngram_range = (1, 1), max_df = 0.8)
    top_words = []

    try:
        word_count_vector = cv.fit_transform(sum_lemmas)
        tfidf_transformer = TfidfTransformer(smooth_idf = True, use_idf = True)
        tfidf_transformer.fit(word_count_vector)

        count_vector = cv.transform(sum_lemmas)
        tf_idf_vector = tfidf_transformer.transform(count_vector)

        top_words = cv.get_feature_names()

    except Exception as e:
        print("error accured")

    if verbose is True:
        print(top_words)

    base_url = "http://127.0.0.1:5000/word2vec?word="

    vector_np = np.array([0] * 38)

    for word in top_words:
        link = base_url + word
        req = requests.get(link)
        try:
            v = req.json()['word2vec'][0]
            if v == '':
                v = [0] * 38
            v_np = np.array(v)
            vector_np = np.add(vector_np, v_np)
        except:
            pass
    vv = (vector_np/20.).tolist()

    ## Composition of Extracted Features and Word2Vec Vectors

    all_vector = vv + normalized.reshape(1, 20).tolist()[0]

    if verbose is True:
        print(all_vector)

    return all_vector


def cluster(username, vector, debug = False):
    # Clustering
    pass
    

if __name__ == '__main__':
    debugging = False
    from_file = False
    verbose = False
    args = sys.argv
    if len(args) > 1 :
        username = args[1]
        if "--debug" in args:
            debugging = True
        if "--file" in args:
            from_file = True
        if "--verbose" in args:
            verbose = True
    else :
        username = input("Enter username: ")
    vector = calculate_vector(username, from_file, debugging, verbose)
    print(vector)