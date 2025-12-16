import { DeliveryStatus, FragmentType, Message } from "@/types/global";
import { Base64String } from "@/utils/Base64String";
import { getRandomBytes } from "expo-crypto";
import {
  extractFragmentMetadata,
  fragmentPayload,
  reassembleFragments,
} from "../frag-service";
import {
  fromBinaryPayload,
  toBinaryPayload,
} from "../message-protocol-service";

test("fragment & re-assemble", () => {
  const message: Message = {
    id: "1",
    sender: "2",
    contents: Base64String.fromBytes(getRandomBytes(1000)).getValue(),
    timestamp: Date.now(),
    isRelay: false,
    originalSender: null,
    isPrivate: true,
    recipientNickname: "@ace",
    senderPeerId: "p2",
    deliveryStatus: DeliveryStatus.SENDING,
  };

  const { fragments } = fragmentPayload(
    toBinaryPayload(message)!,
    "from",
    "to",
    FragmentType.MESSAGE,
  );

  const meta = extractFragmentMetadata(fragments[0]);

  console.log(meta?.fragmentId);

  expect(meta?.fragmentId).not.toBeNull();
  expect(meta?.index).toBe(0);

  const reassembledMessage = reassembleFragments(fragments)!;
  const decodedMessage = fromBinaryPayload(reassembledMessage.data);

  expect(decodedMessage.contents).toEqual(message.contents);
});
