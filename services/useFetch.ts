import { useEffect, useState } from 'react';

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch= true) => { // Generic type T for the data type
    const [data, setData] = useState<T | null>(null); // tip T ili null, default null
    const [loading, setLoading] = useState(false); // loading state
    const [error, setError] = useState<Error | null>(null); // error state



    const fetchData = async () => {
        try{
            setLoading(true);
            setError(null);

            const result = await fetchFunction();

            setData(result);
        } catch (err) {
            // @ts-ignore
            setError(err instanceof Error ? err : new Error('An error occured'));
        } finally {
            setLoading(false);
        }
    }
    
    const reset = () => {
        setData(null);
        setError(null);
        setLoading(false);
    }

    useEffect(() => {
     if(autoFetch) {
        fetchData();
     }   
    }, []);

    return { data, loading, error, refetch: fetchData, reset };
}

export default useFetch;