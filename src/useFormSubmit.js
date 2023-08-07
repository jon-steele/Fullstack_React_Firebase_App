// useFormSubmit.js
import { useCallback } from 'react';
import useFirebase from './useFirebase'; 

const useFormSubmit = () => {
  const { add, update } = useFirebase('users'); 

  const onSubmit = useCallback(async (formData, editIndex) => {
    if (editIndex !== -1) {
      await update(formData.id, formData);
    } else {
      await add(formData);
    }
  }, [add, update]);

  return onSubmit;
};

export default useFormSubmit;
