import Form from './Form';

export default function Edit({ seo }) {
       return (
              <Form
                     title="Edit SEO Record"
                     heading="Edit SEO Record"
                     seo={seo}
                     submitLabel="Update Record"
                     submitRoute={route('admin.seo.update', seo.id)}
                     submitMethod="put"
              />
       );
}
