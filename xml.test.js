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
        const actual = XML.prettify(
            '<w:r><w:t>Lorem ipsum</w:t></w:r>'+
            '<w:r><w:t xml:space="preserve"> dolor sit amet</w:t></w:r>'
        );
        expect(actual).toEqual(ml`
            <w:r>
                <w:t>
                    Lorem ipsum
                </w:t>
            </w:r>
            <w:r>
                <w:t xml:space="preserve">
                     dolor sit amet
                </w:t>
            </w:r>
        `);

        const text = XML.prettify(
            '<w:p w14:paraId="1CBC2627" w14:textId="241FF372"><w:t>Lorem ipsum</w:t>'+
            ' dolor sit amet'+
            '<w:r><w:t xml:space="preserve"> consectetur adipiscing elit</w:t></w:r></w:p>'
        );
        expect(text).toEqual(ml`
            <w:p w14:paraId="1CBC2627" w14:textId="241FF372">
                <w:t>
                    Lorem ipsum
                </w:t>
                 dolor sit amet
                <w:r>
                    <w:t xml:space="preserve">
                         consectetur adipiscing elit
                    </w:t>
                </w:r>
            </w:p>
        `);
    });

    it('Should indent attributes that are too long', () => {
        const actual = XML.prettify(
            '<w:p w:rsidR="6332322D" w:rsidP="6332322D" '+
            'w:rsidRDefault="6332322D" w14:paraId="1CBC2627" w14:textId="241FF372"/>'+
            '<w:p w:rsidR="6332322D" w:rsidP="6332322D" '+
            'w:rsidRDefault="6332322D" w14:paraId="146722E1" w14:textId="1383D343">'+
            '<w:pPr><w:pStyle w:val="Heading2"/></w:pPr>'+
            '<w:r w:rsidR="6332322D"><w:rPr/><w:t>Definition</w:t></w:r></w:p>'
        );
        expect(actual).toEqual(ml`
            <w:p
                w:rsidR="6332322D"
                w:rsidP="6332322D"
                w:rsidRDefault="6332322D"
                w14:paraId="1CBC2627"
                w14:textId="241FF372"
            />
            <w:p
                w:rsidR="6332322D"
                w:rsidP="6332322D"
                w:rsidRDefault="6332322D"
                w14:paraId="146722E1"
                w14:textId="1383D343"
            >
                <w:pPr>
                    <w:pStyle w:val="Heading2"/>
                </w:pPr>
                <w:r w:rsidR="6332322D">
                    <w:rPr/>
                    <w:t>
                        Definition
                    </w:t>
                </w:r>
            </w:p>
        `);
    });
});