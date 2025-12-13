import { Member } from "../member";

test.skip("serialization of member", async () => {
  const member = await Member.create("bob");
  const serialized = member.serialize();
  const deserialized = Member.deserialize(serialized);

  console.log(member.ecdhPrivateKey);
  console.log(deserialized.ecdhPublicKey);

  expect(member.ecdhPrivateKey).toEqual(deserialized.ecdhPrivateKey);
  expect(member.ecdhPublicKey).toEqual(deserialized.ecdhPublicKey);
});
