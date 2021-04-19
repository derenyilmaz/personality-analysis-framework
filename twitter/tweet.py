
class Tweet:
    __id = 0
    __time = 0
    __full_text = None
    __rt = False
    __lemma = []
    __pos = None
    __normalized_text = None
    __img_url = None # TODO
    __vector = None
    __smiling_emoji = 0
    __negative_emoji = 0
    __typo = 0

    def __init__(self):
        self.__pos = dict()
        pass

    def __init__(self, id, time, tweet, rt):
        self.__id = id
        self.__time = time
        self.__full_text = tweet
        self.__rt = rt
        self.__pos = dict()

    def get_csv(self):
        return map(str, (self.__id, self.__time, self.__full_text, self.__rt))

    def map_tweet(self, function):
        self.__full_text, self.__smiling_emoji, self.__negative_emoji = function(self.__full_text)
        return self

    def set_normalized_tweet(self, tweet):
        self.__normalized_text = tweet

    def get_normalized_tweet(self):
        return self.__normalized_text

    def get_tweet(self):
        return self.__full_text

    def get_lemma(self):
        return self.__lemma

    def set_lemma(self, lemma):
        self.__lemma = lemma

    def get_time(self):
        return self.__time

    def add_pos(self, pos):
        if pos in self.__pos:
            self.__pos[pos] += 1
        else :
            self.__pos[pos] = 1

    def set_pos(self, pos, val):
        self.__pos[pos] = val

    def get_pos(self):
        return self.__pos

    def set_vector(self, vector):
        self.__vector = vector

    def get_vector(self):
        return self.__vector

    def set_smiling_emoji(self, val):
        self.__smiling_emoji = val

    def get_smiling_emoji(self):
        return self.__smiling_emoji

    def set_negative_emoji(self, val):
        self.__negative_emoji = val

    def get_negative_emoji(self):
        return self.__negative_emoji

    def set_typo_ratio(self, typo):
        self.__typo += typo

    def get_typo_ratio(self):
        return self.__typo




