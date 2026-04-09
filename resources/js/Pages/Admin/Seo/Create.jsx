import Form from './Form';

export default function Create() {
       return (
              <Form
                     title="Add SEO Record"
                     heading="Add SEO Record"
                     submitLabel="Create Record"
                     submitRoute={route('admin.seo.store')}
              />
       );
}
