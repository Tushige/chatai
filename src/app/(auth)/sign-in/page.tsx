import SigninFormProvider from '@/components/forms/sign-in/form-provider';
import SigninForm from '@/components/forms/sign-in/sign-in-form';

const Page = () => {
  return (
    <div className='flex h-full w-full flex-col gap-3 py-36 md:px-16'>
      <SigninFormProvider>
        <SigninForm />
      </SigninFormProvider>
    </div>
  );
};

export default Page;
