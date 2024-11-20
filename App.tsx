import React, {useCallback, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ListRenderItem,
  Button,
  Text,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import {useEffect} from 'react';
import {
  AudioSession,
  LiveKitRoom,
  useTracks,
  TrackReferenceOrPlaceholder,
  VideoTrack,
  isTrackReference,
} from '@livekit/react-native';
import {Track} from 'livekit-client';

const wsURL = 'wss://flutterflow-uwvr67ix.livekit.cloud';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzIxMjc1NTcsImlzcyI6IkFQSW80SHc2TG50b2VrUCIsIm5iZiI6MTczMjEyNjY1Nywic3ViIjoic2FtIiwidmlkZW8iOnsicm9vbSI6InNhcm1lZCIsInJvb21Kb2luIjp0cnVlLCJyb29tTGlzdCI6dHJ1ZX19.PERxvMotkGinZMUbd2kk6_j8gs3CvHN-JEVizgtuaKs';
function onDeviceFailure(error: any) {
  console.error(error, 'onDeviceFailure');
}

export default function App() {
  const [connectionDetails, updateConnectionDetails] = useState(undefined);
  const [agentState, setAgentState] = useState('disconnected');

  const onConnectButtonClicked = useCallback(async () => {
    // Generate room connection details, including:
    //   - A random Room name
    //   - A random Participant name
    //   - An Access Token to permit the participant to join the room
    //   - The URL of the LiveKit server to connect to
    //
    // In real-world application, you would likely allow the user to specify their
    // own participant name, and possibly to choose from existing rooms to join.

    // const url = new URL('http://localhost:3000/api/connection-details');
    try {
      const response = await fetch(
        'http://10.0.2.2:3000/api/connection-details',
        {
          method: 'GET',
        },
      );
      console.log({response});
      const connectionDetailsData = await response.json();
      console.log({connectionDetailsData});
      updateConnectionDetails(connectionDetailsData);
    } catch (error) {
      console.log({error});
    }
  }, []);
  console.log({connectionDetails});
  // Start the audio session first.
  useEffect(() => {
    let start = async () => {
      await AudioSession.startAudioSession();
    };

    start();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);

  return (
    <LiveKitRoom
      token={connectionDetails?.participantToken}
      serverUrl={connectionDetails?.serverUrl}
      connect={connectionDetails !== undefined}
      audio={true}
      video={false}
      onMediaDeviceFailure={onDeviceFailure}
      onDisconnected={() => {
        updateConnectionDetails(undefined);
      }}
      options={{
        // Use screen pixel density to handle screens with differing densities.
        adaptiveStream: {pixelDensity: 'screen'},
      }}>
      <RoomView onConnectButtonClicked={onConnectButtonClicked} />
      {/* <VoiceAssistantControlBar controls={{ leave: false }} /> */}
    </LiveKitRoom>
  );
}

const RoomView = ({onConnectButtonClicked}: any) => {
  // Get all camera tracks.
  // The useTracks hook grabs the tracks from LiveKitRoom component
  // providing the context for the Room object.
  // const tracks = useTracks([Track.Source.Camera]);

  // const renderTrack: ListRenderItem<TrackReferenceOrPlaceholder> = ({item}) => {
  //   console.log({item});
  //   // Render using the VideoTrack component.
  //   if (isTrackReference(item)) {
  //     return <VideoTrack trackRef={item} style={styles.participantView} />;
  //   } else {
  //     return <View style={styles.participantView} />;
  //   }
  // };

  return (
    <View style={styles.container}>
      <View style={styles.participantView}>
        <TouchableHighlight
          onPress={onConnectButtonClicked}
          style={{
            borderRadius: 23,
          }}>
          <Text>Start Conversation</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  participantView: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'black',
    // borderColor: 'yellow',
  },
  participantViewButton: {},
});
