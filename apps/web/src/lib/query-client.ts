import { QueryClient } from "@tanstack/react-query";


const queryClient = new QueryClient({
    defaultOptions:{
        queries:{
            staleTime:1000*60*5, // 5 MIN
            gcTime : 1000*60*10, //10 min
            retry :1,
            refetchOnWindowFocus : false,
        },
        mutations:{
            retry : 0,
        }
    }
});

export default queryClient;