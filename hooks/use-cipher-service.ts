import * as Crypto from "expo-crypto";
import { useState } from "react";
import {
  ClientState,
  createApplicationMessage,
  createCommit,
  CreateCommitResult,
  createGroup,
  Credential,
  decodeMlsMessage,
  defaultCapabilities,
  defaultLifetime,
  emptyPskIndex,
  encodeMlsMessage,
  generateKeyPackage,
  getCiphersuiteFromName,
  getCiphersuiteImpl,
  joinGroup,
  KeyPackage,
  PrivateKeyPackage,
  PrivateMessage,
  Proposal,
  Welcome,
} from "ts-mls";

type MLSKeyPackage = {
  publicPackage: KeyPackage;
  privatePackage: PrivateKeyPackage;
};

const impl = await getCiphersuiteImpl(
  getCiphersuiteFromName("MLS_256_XWING_AES256GCM_SHA512_Ed25519"),
);

export function useCipherService() {
  // map of group id to MLS client state
  const [clientState, setClientState] = useState<Map<string, ClientState>>(
    new Map(),
  );

  const updateClientState = (groupId: string, clientState: ClientState) => {
    setClientState((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.set(groupId, clientState);
      return newMap;
    });
  };

  const getPeerCredential = (peerId: string): Credential => {
    return {
      credentialType: "basic",
      identity: new TextEncoder().encode(peerId),
    };
  };

  const getKeyPackage = async (
    credential: Credential,
  ): Promise<MLSKeyPackage> => {
    return await generateKeyPackage(
      credential,
      defaultCapabilities(),
      defaultLifetime,
      [],
      impl,
    );
  };

  const constructGroup = async (
    groupId: string,
    initialKeyPackage: MLSKeyPackage,
  ): Promise<ClientState> => {
    const id = new TextEncoder().encode(groupId);
    return await createGroup(
      id,
      initialKeyPackage.publicPackage,
      initialKeyPackage.privatePackage,
      [],
      impl,
    );
  };

  const getAddMemberProposal = (
    memberToAddKeyPackage: KeyPackage,
  ): Proposal => {
    return {
      proposalType: "add",
      add: { keyPackage: memberToAddKeyPackage },
    };
  };

  const commitProposal = async (
    group: ClientState,
    proposal: Proposal,
  ): Promise<CreateCommitResult> => {
    return await createCommit(
      { state: group, cipherSuite: impl },
      {
        extraProposals: [proposal],
        ratchetTreeExtension: true,
      },
    );
  };

  const joinExistingGroup = async (
    welcome: Welcome,
    outsiderKeyPackage: MLSKeyPackage,
  ): Promise<ClientState> => {
    return await joinGroup(
      welcome,
      outsiderKeyPackage.publicPackage,
      outsiderKeyPackage.privatePackage,
      emptyPskIndex,
      impl,
    );
  };

  const startGroup = async (
    peerId: string,
    peerToAdd: KeyPackage,
    groupId: string | null,
  ): Promise<{
    groupId: string;
    clientState: ClientState;
    welcome: Welcome;
  }> => {
    const credential = getPeerCredential(peerId);
    const keyPkg = await getKeyPackage(credential);
    const resolvedGroupId = groupId ? groupId : Crypto.randomUUID();
    const group = await constructGroup(resolvedGroupId, keyPkg);
    const peerToAddProposal = getAddMemberProposal(peerToAdd);
    const commitResult = await commitProposal(group, peerToAddProposal);

    if (!commitResult.welcome)
      throw new Error("Failed to constuct Welcome when starting group!");

    updateClientState(resolvedGroupId, commitResult.newState);

    return {
      groupId: resolvedGroupId,
      clientState: commitResult.newState,
      welcome: commitResult.welcome,
    };
  };

  const encodeMLSMessage = (
    wireFormat: string,
    payload: Welcome | KeyPackage | PrivateMessage,
  ): Uint8Array | undefined => {
    switch (wireFormat) {
      case "mls_welcome":
        return encodeMlsMessage({
          welcome: payload as Welcome,
          wireformat: "mls_welcome",
          version: "mls10",
        });
      case "mls_key_package":
        return encodeMlsMessage({
          keyPackage: payload as KeyPackage,
          wireformat: "mls_key_package",
          version: "mls10",
        });
      case "mls_private_messsage":
        return encodeMlsMessage({
          privateMessage: payload as PrivateMessage,
          wireformat: "mls_private_message",
          version: "mls10",
        });
      default:
        console.warn("Unsupported wire format");
        break;
    }
  };

  const decodeMLSMessage = (
    wireFormat: string,
    payload: Uint8Array,
  ): Welcome | KeyPackage | PrivateMessage => {};

  const decodeMLSWelcome = (welcome: Uint8Array): Welcome => {
    const decoded = decodeMlsMessage(welcome, 0)![0];

    if (decoded.wireformat !== "mls_welcome") {
      throw new Error("Expected welcome");
    }

    return decoded.welcome;
  };

  const encryptMessage = async (
    groupId: string,
    contents: Uint8Array,
  ): Promise<PrivateMessage> => {
    const messageResult = await createApplicationMessage(
      clientState.get(groupId)!,
      contents,
      impl,
    );

    updateClientState(groupId, messageResult.newState);

    return messageResult.privateMessage;
  };

  const decryptMessage = async (groupId: string, contents: Uint8Array) => {};

  return {
    encryptMessage,
    startGroup,
    joinExistingGroup,
    encodeMLSMessage,
  };
}
