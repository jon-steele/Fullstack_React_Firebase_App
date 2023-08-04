import './App.css';
import '@coreui/coreui/dist/css/coreui.min.css';
import Form from './form';
import { FormProvider, useForm } from 'react-hook-form';

const App = () => {
  const methods = useForm();
  return (
    <div className="c-app">
      {/* Add CoreUI components and navigation here */}
      <main className="c-main">
        <div className="container-fluid">
          <div className="fade-in">
            <FormProvider {...methods}>
              <Form />
            </FormProvider>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
