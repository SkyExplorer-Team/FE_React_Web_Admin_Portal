import validateEmailExpression from "./ValidateEmailExpression";

const handleBlurUsernameInput = (e: string,
                    setUsername: React.Dispatch<React.SetStateAction<string>>,
                    setInputBorderEmail: React.Dispatch<React.SetStateAction<string>>,
                    setIsEmailValid: React.Dispatch<React.SetStateAction<boolean>>) : void => {
                    setUsername(e)
                    if (e !== "") {
                    if (!validateEmailExpression(e)) {
                        setInputBorderEmail('is-invalid');
                        setIsEmailValid(false)
                    } else {
                        setInputBorderEmail('true-input');
                        setIsEmailValid(true)
                    }
                    } else {
                    setInputBorderEmail('');
                    setIsEmailValid(false)
                    }
                };

  export default handleBlurUsernameInput;