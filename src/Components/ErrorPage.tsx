import { useRouteError } from "react-router-dom";
export default function ErrorPage() {
  const error = useRouteError();

  let errorMessage:any;
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (error && typeof error === 'object' && 'statusText' in error) {
    errorMessage = error.statusText;
  } else {
    errorMessage = "Sorry, an unexpected error has occurred.";
  }

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>{errorMessage}</p>
      <button onClick={() => window.location.href = '/'}>Volver al inicio</button>
    </div>
  );
}