/**
 * App entry point.
 * Initializes Firebase notifications and registers the main App component.
 */
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import 'react-native-reanimated';
import '@api/notifications';

AppRegistry.registerComponent(appName, () => App);
