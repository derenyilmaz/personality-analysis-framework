# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
import grpc

import zemberek.preprocess_pb2 as preprocess__pb2


class PreprocessingServiceStub(object):
  # missing associated documentation comment in .proto file
  pass

  def __init__(self, channel):
    """Constructor.

    Args:
      channel: A grpc.Channel.
    """
    self.Tokenize = channel.unary_unary(
        '/zemberek.preprocessor.PreprocessingService/Tokenize',
        request_serializer=preprocess__pb2.TokenizationRequest.SerializeToString,
        response_deserializer=preprocess__pb2.TokenizationResponse.FromString,
        )
    self.ExtractSentences = channel.unary_unary(
        '/zemberek.preprocessor.PreprocessingService/ExtractSentences',
        request_serializer=preprocess__pb2.SentenceExtractionRequest.SerializeToString,
        response_deserializer=preprocess__pb2.SentenceExtractionResponse.FromString,
        )


class PreprocessingServiceServicer(object):
  # missing associated documentation comment in .proto file
  pass

  def Tokenize(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def ExtractSentences(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')


def add_PreprocessingServiceServicer_to_server(servicer, server):
  rpc_method_handlers = {
      'Tokenize': grpc.unary_unary_rpc_method_handler(
          servicer.Tokenize,
          request_deserializer=preprocess__pb2.TokenizationRequest.FromString,
          response_serializer=preprocess__pb2.TokenizationResponse.SerializeToString,
      ),
      'ExtractSentences': grpc.unary_unary_rpc_method_handler(
          servicer.ExtractSentences,
          request_deserializer=preprocess__pb2.SentenceExtractionRequest.FromString,
          response_serializer=preprocess__pb2.SentenceExtractionResponse.SerializeToString,
      ),
  }
  generic_handler = grpc.method_handlers_generic_handler(
      'zemberek.preprocessor.PreprocessingService', rpc_method_handlers)
  server.add_generic_rpc_handlers((generic_handler,))
