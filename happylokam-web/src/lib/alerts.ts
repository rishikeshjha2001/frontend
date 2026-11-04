import Swal from 'sweetalert2';

const MySwal = Swal.mixin({
  confirmButtonColor: '#e11d48', // rose-600
  cancelButtonColor: '#6b7280', // gray-500
});

export const confirmAction = async (title: string, text: string) => {
  return MySwal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, proceed',
    cancelButtonText: 'Cancel',
  });
};

export const showAlert = async (title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info') => {
  return MySwal.fire({
    title,
    text,
    icon,
    confirmButtonText: 'OK',
  });
};
