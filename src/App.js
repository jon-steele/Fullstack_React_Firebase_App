import "./App.css";
import "@coreui/coreui/dist/css/coreui.min.css";
import Form from "./form";
import { FormProvider, useForm } from "react-hook-form";

const App = () => {
  const methods = useForm();
  return (
    <div>
      <FormProvider {...methods}>
        <Form />
      </FormProvider>
    </div>
  );
};

export default App;
