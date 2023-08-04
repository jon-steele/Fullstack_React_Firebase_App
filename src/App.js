import "./App.css";
import "@coreui/coreui/dist/css/coreui.min.css";
import Form from "./form";
import { FormProvider, useForm } from "react-hook-form";

const App = () => {
  const methods = useForm();
  return (
    <div className="c-app c-default-layout">
      {/* Add CoreUI components and navigation here */}
      <div className="c-main">
        <main className="c-main">
          <FormProvider {...methods}>
            <Form />
          </FormProvider>
        </main>
      </div>
    </div>
  );
};

export default App;
