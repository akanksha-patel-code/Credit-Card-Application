import React from 'react';

import { QueryClient, QueryClientProvider } from 'react-query';
import Main from './Main';

const App = () => {
	const queryClient = new QueryClient();
	return (
		<QueryClientProvider client={queryClient}>
				<Main />
		</QueryClientProvider>
	);
};

export default App;
