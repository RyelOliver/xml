const ml = require('@ryel/multiline');
const XML = require('./xml');

describe('XML', () => {
    describe('Indent', () => {
        it('Should not indent', () => {
            [ 0, -3 ].forEach(tabs => {
                const actual = XML.indent('<w:t>Lorem ipsum</w:t>').by(tabs);
                expect(actual).toEqual('<w:t>Lorem ipsum</w:t>');
            });
        });

        it('Should indent', () => {
            const actual = XML.indent('<w:t>Lorem ipsum</w:t>').by(1);
            expect(actual).toEqual('    <w:t>Lorem ipsum</w:t>');
        });

        it('Should indent by more than 1 tab', () => {
            const actual = XML.indent('<w:t>Lorem ipsum</w:t>').by(3);
            expect(actual).toEqual('            <w:t>Lorem ipsum</w:t>');
        });
    });

    it('Should indent child nodes', () => {
        const singleChild = XML.prettify(
            '<w:r><w:t>Lorem ipsum</w:t></w:r>'+
            '<w:r><w:t xml:space="preserve"> dolor sit amet</w:t></w:r>'
        );
        expect(singleChild).toEqual(ml`
            <w:r>
                <w:t>Lorem ipsum</w:t>
            </w:r>
            <w:r>
                <w:t xml:space="preserve"> dolor sit amet</w:t>
            </w:r>
        `);

        const multiChild = XML.prettify(
            '<w:p w14:paraId="1CBC2627" w14:textId="241FF372">lorem <w:t>ipsum</w:t>'+
            ' dolor sit amet'+
            '<w:r><w:t xml:space="preserve"> consectetur adipiscing elit</w:t></w:r>'+
            ' sed do eiusmod tempor</w:p>'
        );
        expect(multiChild).toEqual(ml`
            <w:p w14:paraId="1CBC2627" w14:textId="241FF372">
                lorem 
                <w:t>ipsum</w:t>
                 dolor sit amet
                <w:r>
                    <w:t xml:space="preserve"> consectetur adipiscing elit</w:t>
                </w:r>
                 sed do eiusmod tempor
            </w:p>
        `);
    });

    it('Should indent attributes that are too long', () => {
        const actual = XML.prettify(
            '<w:del w:id="1" w:author="Lupe Fiasco" w:date="2000-01-12T13:20:00Z"/>'
        );
        expect(actual).toEqual(ml`
            <w:del
                w:id="1"
                w:author="Lupe Fiasco"
                w:date="2000-01-12T13:20:00Z"
            />
        `);
    });

    it('Should indent attributes without breaking text content onto new lines', () => {
        const actual = XML.prettify(
            '<w:t xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'+
            'On sharp objects in large pockets</w:t>'
        );
        expect(actual).toEqual(ml`
            <w:t
                xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            >On sharp objects in large pockets</w:t>
        `);
    });
});