import "./App.css";
import "@coreui/coreui/dist/css/coreui.min.css";
import Form from "./form";
import { FormProvider, useForm } from "react-hook-form";

const App = () => {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <Form />
    </FormProvider>
  );
};

export default App;
