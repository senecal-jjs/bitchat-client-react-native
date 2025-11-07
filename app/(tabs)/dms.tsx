
import { ChatBubble } from '@/components/chat-bubble';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useRef, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


const renderMessage = ({item}) => {
  return <ChatBubble message={item} />
}


export default function TabTwoScreen() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      contents: "Hello!",
      isMine: true, 
    },
    {
      id: "2",
      contents: "Hello Back!",
      isMine: false, 
    }
  ])

  // State for the new message input
  const [newMessage, setNewMessage] = useState('');

  // A ref to automatically scroll the message list
  const flatListRef = useRef(null);

  const handleSend = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: Math.random().toString(),
        contents: newMessage,
        isMine: false,
      }
      setMessages([...messages, newMsg])
      setNewMessage('')

      // scroll to the end of the list to show the new message
      flatListRef.current.scrollToEnd({ animated: true })

      // dismiss the keyboard after sending
      Keyboard.dismiss()
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.mainContainer}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
          <View style={styles.chatHeader}>
            <View style={{ 'width': 28 }}></View>
            <Text style={styles.headerText}>Chats</Text>
            <IconSymbol size={28} name="square.and.pencil" color={'white'}></IconSymbol>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            showsVerticalScrollIndicator={false}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
          />

          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="What's on your mind?"
              placeholderTextColor="gray"
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text>Send</Text>
            </TouchableOpacity>    
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  chatHeader: {  
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    backgroundColor: '#2377F1',
    borderRadius: '20px'
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#090909ff'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#090909ff',
    color: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: 120,
    borderColor: 'rgba(172, 169, 169, 0.2)',
    borderWidth: 1,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#0B93F6',
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

  // return (
  //   <ParallaxScrollView
  //     headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
  //     headerImage={
  //       <IconSymbol
  //         size={310}
  //         color="#808080"
  //         name="chevron.left.forwardslash.chevron.right"
  //         style={styles.headerImage}
  //       />
  //     }>
  //     <ThemedView style={styles.titleContainer}>
  //       <ThemedText
  //         type="title"
  //         style={{
  //           fontFamily: Fonts.rounded,
  //         }}>
  //         Explore
  //       </ThemedText>
  //     </ThemedView>
  //     <ThemedText>This app includes example code to help you get started.</ThemedText>
  //     <Collapsible title="File-based routing">
  //       <ThemedText>
  //         This app has two screens:{' '}
  //         <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
  //         <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
  //       </ThemedText>
  //       <ThemedText>
  //         The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
  //         sets up the tab navigator.
  //       </ThemedText>
  //       <ExternalLink href="https://docs.expo.dev/router/introduction">
  //         <ThemedText type="link">Learn more</ThemedText>
  //       </ExternalLink>
  //     </Collapsible>
  //     <Collapsible title="Android, iOS, and web support">
  //       <ThemedText>
  //         You can open this project on Android, iOS, and the web. To open the web version, press{' '}
  //         <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
  //       </ThemedText>
  //     </Collapsible>
  //     <Collapsible title="Images">
  //       <ThemedText>
  //         For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
  //         <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
  //         different screen densities
  //       </ThemedText>
  //       <Image
  //         source={require('@/assets/images/react-logo.png')}
  //         style={{ width: 100, height: 100, alignSelf: 'center' }}
  //       />
  //       <ExternalLink href="https://reactnative.dev/docs/images">
  //         <ThemedText type="link">Learn more</ThemedText>
  //       </ExternalLink>
  //     </Collapsible>
  //     <Collapsible title="Light and dark mode components">
  //       <ThemedText>
  //         This template has light and dark mode support. The{' '}
  //         <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
  //         what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
  //       </ThemedText>
  //       <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
  //         <ThemedText type="link">Learn more</ThemedText>
  //       </ExternalLink>
  //     </Collapsible>
  //     <Collapsible title="Animations">
  //       <ThemedText>
  //         This template includes an example of an animated component. The{' '}
  //         <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
  //         the powerful{' '}
  //         <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
  //           react-native-reanimated
  //         </ThemedText>{' '}
  //         library to create a waving hand animation.
  //       </ThemedText>
  //       {Platform.select({
  //         ios: (
  //           <ThemedText>
  //             The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
  //             component provides a parallax effect for the header image.
  //           </ThemedText>
  //         ),
  //       })}
  //     </Collapsible>
  //   </ParallaxScrollView>
  // );