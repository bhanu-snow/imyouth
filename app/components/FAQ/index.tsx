"use client"
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'

interface FaqProps {
  data: {
    title: string;
    QAs: { guid: string; question_en: string; answer_en: string; question_hi: string; answer_hi: string; }[];         
  };
}
// const FAQ = () => {
export default function FAQ({ data }: FaqProps) {
    //console.log('FAQ received data:', data);

    return (
        <div id="faq-section" className='mx-auto max-w-7xl py-4 lg:px-8 bg-faqblue rounded-2xl my-16 faq-bg'>
            <h3 className='text-xl font-normal text-white text-center mb-6'>FAQ</h3>
            <h2 className='text-4xl lg:text-6xl font-semibold text-center text-white'>{data.title}</h2>
            <div className="w-full px-4 pt-16">
                {data.QAs.map((qa) => (
                <div key={qa.guid} className="mx-auto w-full max-w-5xl rounded-2xl bg-white py-8 px-6 mb-5">
                    <Disclosure>
                        {({ open }) => (
                            <>
                                <Disclosure.Button className="flex w-full justify-between rounded-lg px-4 py-2 text-left text-xl font-medium">
                                    <span>{qa.question_en} <br /> {qa.question_hi}</span>
                                    <ChevronUpIcon
                                        className={`${open ? 'rotate-180 transform' : ''
                                            } h-5 w-5 text-purple-500`}
                                    />
                                </Disclosure.Button>
                                <Disclosure.Panel className="px-12 pt-8 pb-2 text-base text-iuml-green font-normal">
                                    {qa.answer_en} <br /> <br /> {qa.answer_hi}
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                </div>
            ))}

            </div>
        </div>
    )
}