'use client';
import { useCallback, useState } from 'react';
import { useToast } from './use-toast';

const useCopyToClipboard = () => {
  const [state, setState] = useState();
  const { toast } = useToast();
  const copyToClipBoard = useCallback((value) => {
    const handleCopy = async () => {
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          setState(value);
          toast({
            title: '⭐ Code Copied',
          });
        } else {
          throw new Error('writeText not supported');
        }
      } catch (e) {
        console.error(e);
        toast({
          title: '😔 failed to copy',
        });
      }
    };
    handleCopy();
  }, [toast]);
  return [state, copyToClipBoard];
};

export default useCopyToClipboard;
