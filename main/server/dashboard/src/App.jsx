import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Main from './pages/Main';
import FakeDataProvider from './contexts/FakeDataProvider';
import StatusProvider from './contexts/StatusProvider';
import ConfigProvider from './contexts/ConfigProvider';
import MediaProvider from './contexts/MediaProvider';
import DeviceProvider from './contexts/DeviceProvider';
import SyncGroupProvider from './contexts/SyncGroupProvider';

function App() {
	return (
		<ConfigProvider>
			<StatusProvider>
				<SyncGroupProvider>
					<DeviceProvider>
						<MediaProvider>
							<Main />
						</MediaProvider>
					</DeviceProvider>
				</SyncGroupProvider>
			</StatusProvider>
		</ConfigProvider>
	)
}

export default App
