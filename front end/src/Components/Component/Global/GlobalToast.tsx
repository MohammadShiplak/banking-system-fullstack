

// GlobalToast.tsx
import { Toast, ToastContainer } from 'react-bootstrap';

type ToastType = 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

interface GlobalToastProps {
  isVisible: boolean;
  message: string;
  type: ToastType;
  onClose: () => void;
}

const GlobalToast = ({ isVisible, message, type, onClose }: GlobalToastProps) => {
  if (!isVisible) return null;

  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast 
        show={isVisible} 
        onClose={onClose}
        delay={4000} 
        autohide
        bg={type}
      >
        <Toast.Header>
          <strong className="me-auto text-capitalize">
            {type}
          </strong>
        </Toast.Header>
        <Toast.Body className={type === 'light' ? 'text-dark' : 'text-white'}>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default GlobalToast;
